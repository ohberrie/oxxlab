/* ============================================================
   PANEL FLATTEN — 판재 평탄화 도면 (사용자 작업 로직의 인터랙티브 프리뷰)
   목적: 3D 공간의 입체 판재에서 레이저 커팅용 면(커브)을 따서, 밑변을 가로로
   통일해 라벨 도면으로 정렬한다.
   · 좌: 드래그로 돌려보는 3D 그리드 + 기울어진 판재 입체들
   · 우: 각 면에서 추출한 2D 도면(레이저 커브) — 밑변 정렬 + A-01 라벨 그리드
   · 좌측 호버 시 해당 면의 2D 도면이 함께 강조(3D↔2D 대응)
   window.SIMS["panel-flatten"](canvas, opts)
   주의: 회전 통일 기준은 바운딩박스가 아니라 '면평면×바닥평면 교선=밑변'(원 코드 2단계).
   ============================================================ */
(function () {
  "use strict";
  var INK = "#1a1a1c", FILL = "#f2f1ec", ACC = "#9a6a16", GRID = "#d9d8d2", FAINT = "#b4b4b0";

  window.SIMS = window.SIMS || {};
  window.SIMS["panel-flatten"] = function (canvas, opts) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    var W = 0, H = 0, SPLIT = 0.56;
    var N = 6, cols = 3;
    var showLabels = true, auto = true;
    var yaw = 0.7, pitch = 0.92, scale3 = 1, cx3 = 0, cy3 = 0, sceneC = [0, 0, 0];
    var panels = [], hover = -1, raf = null, last = 0, statusCb = function () {};
    var dragging = false, lastX = 0, lastY = 0;
    var mode = "scatter";   // "scatter"(흩어진 판재) | "box"(입체 박스 전개)

    function size() {
      var r = canvas.getBoundingClientRect();
      var w = r.width || 540, h = Math.round(w * 0.6);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.height = h + "px"; W = w; H = h;
    }
    function pad2(n) { return (n < 10 ? "0" : "") + n; }

    /* ── vec3 ── */
    function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
    function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
    function mul(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
    function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function unit(a) { var l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
    function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); }

    function regen() { if (mode === "box") genBox(); else genPanels(); }

    /* ── 복잡하게 잘린 패널 윤곽(밑변=loc[0]→loc[1], y=0) ── */
    function bounds(loc) {
      var minx = 1e9, maxx = -1e9, maxy = -1e9;
      for (var i = 0; i < loc.length; i++) { if (loc[i][0] < minx) minx = loc[i][0]; if (loc[i][0] > maxx) maxx = loc[i][0]; if (loc[i][1] > maxy) maxy = loc[i][1]; }
      return { w: maxx - minx, h: maxy };
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function complexPanel() {
      var bw = rnd(1.4, 2.8), h = rnd(1.4, 2.8);
      var pts = [[-bw / 2, 0], [bw / 2, 0]];                 // 밑변
      pts.push([bw / 2 + rnd(-0.25, 0.3), h * rnd(0.4, 0.62)]); // 우측면(살짝 꺾임)
      var style = Math.random();
      if (style < 0.34) {                                   // 사선 윗변
        pts.push([bw * rnd(0.1, 0.4), h]);
        pts.push([-bw * rnd(0.2, 0.45), h * rnd(0.78, 0.96)]);
      } else if (style < 0.67) {                            // 윗변 노치(凹)
        pts.push([bw * 0.34, h]);
        pts.push([bw * 0.12, h * rnd(0.62, 0.74)]);
        pts.push([-bw * 0.12, h * rnd(0.62, 0.74)]);
        pts.push([-bw * 0.34, h]);
      } else {                                              // 비대칭 피크
        pts.push([bw * rnd(0.05, 0.25), h]);
        pts.push([-bw * rnd(0.1, 0.3), h * rnd(0.82, 0.95)]);
      }
      pts.push([-bw / 2 + rnd(-0.25, 0.3), h * rnd(0.4, 0.6)]); // 좌측면
      return pts;
    }

    /* ── 판재 생성: 바닥에 선 채 제각각 기울어진 입체(복잡 컷) ── */
    function genPanels() {
      panels = []; hover = -1;
      var gap = 2.3;
      for (var i = 0; i < N; i++) {
        var ox = (i - (N - 1) / 2) * gap;
        var oy = Math.cos((i / Math.max(1, N - 1) - 0.5) * 2.4) * 1.1 - 0.3;
        var O = [ox, oy, 0];
        var ba = (Math.random() - 0.5) * 1.4 + (i - (N - 1) / 2) * 0.12;
        var X = [Math.cos(ba), Math.sin(ba), 0];
        var side = unit(cross(X, [0, 0, 1]));
        var tilt = (Math.random() - 0.5) * 1.0;
        var Y = unit(add(mul([0, 0, 1], Math.cos(tilt)), mul(side, Math.sin(tilt))));
        var loc = complexPanel();
        var bnd = bounds(loc);
        var c3 = loc.map(function (p) { return add(O, add(mul(X, p[0]), mul(Y, p[1]))); });
        var cen = mul(c3.reduce(add, [0, 0, 0]), 1 / c3.length);
        panels.push({ O: O, X: X, Y: Y, loc: loc, c3: c3, cen: cen, w: bnd.w, h: bnd.h, thick: 0.1 });
      }
      fit3D();
    }

    /* ── 입체 박스 생성: 하나의 입체(면마다 얇은 뎁스) → 면들이 전개도로 ── */
    function addFace(c3, label) {
      var bw = dist(c3[0], c3[1]), tw = dist(c3[3], c3[2]);
      var hh = (dist(c3[0], c3[3]) + dist(c3[1], c3[2])) * 0.5;
      var loc = [[-bw / 2, 0], [bw / 2, 0], [tw / 2, hh], [-tw / 2, hh]];
      var X = unit(sub(c3[1], c3[0]));
      var nrm = unit(cross(X, unit(sub(c3[3], c3[0]))));
      var Y = unit(cross(nrm, X));
      var cen = mul(c3.reduce(add, [0, 0, 0]), 1 / c3.length);
      panels.push({ X: X, Y: Y, loc: loc, c3: c3, cen: cen, w: Math.max(bw, tw), h: hh, thick: -0.16, label: label });
    }
    function genBox() {
      panels = []; hover = -1;
      var bw = 2.2 + Math.random() * 1.3, bd = 1.8 + Math.random() * 1.1, hgt = 2.0 + Math.random() * 1.6;
      var shx = (Math.random() - 0.5) * 1.4, shy = (Math.random() - 0.5) * 1.1, tap = 0.62 + Math.random() * 0.34;
      var b = [[-bw / 2, -bd / 2, 0], [bw / 2, -bd / 2, 0], [bw / 2, bd / 2, 0], [-bw / 2, bd / 2, 0]];
      var t = b.map(function (p) { return [p[0] * tap + shx, p[1] * tap + shy, hgt]; });
      var lab = ["A", "B", "C", "D"];
      for (var i = 0; i < 4; i++) { var j = (i + 1) % 4; addFace([b[i], b[j], t[j], t[i]], lab[i]); }
      addFace([t[0], t[1], t[2], t[3]], "E");   // 윗면
      fit3D();
    }

    function fit3D() {
      var c = [0, 0, 0], n = 0, i, k;
      for (i = 0; i < panels.length; i++) for (k = 0; k < panels[i].c3.length; k++) { c = add(c, panels[i].c3[k]); n++; }
      sceneC = n ? mul(c, 1 / n) : [0, 0, 0];
      var maxr = 1;
      for (i = 0; i < panels.length; i++) for (k = 0; k < panels[i].c3.length; k++) {
        var p = panels[i].c3[k];
        var d = Math.hypot(p[0] - sceneC[0], p[1] - sceneC[1], (p[2] - sceneC[2]) * 1.2);
        if (d > maxr) maxr = d;
      }
      var leftW = W * SPLIT;
      scale3 = Math.min(leftW, H) * 0.42 / maxr;
      cx3 = leftW * 0.5; cy3 = H * 0.6;
    }

    function proj(p) {
      var px = p[0] - sceneC[0], py = p[1] - sceneC[1], pz = p[2] - sceneC[2];
      var cyw = Math.cos(yaw), syw = Math.sin(yaw);
      var x1 = px * cyw - py * syw, y1 = px * syw + py * cyw, z1 = pz;
      var cp = Math.cos(pitch), sp = Math.sin(pitch);
      var y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp;
      return { x: cx3 + x1 * scale3, y: cy3 - z2 * scale3, d: y2 };
    }

    /* ── 3D 좌측: 그리드 + 판재 입체 ── */
    function drawGround() {
      var G = 6, step = 1.2;
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      for (var gx = -G; gx <= G; gx += step) {
        var a = proj([gx, -G, 0]), b = proj([gx, G, 0]);
        ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (var gy = -G; gy <= G; gy += step) {
        var a2 = proj([-G, gy, 0]), b2 = proj([G, gy, 0]);
        ctx.beginPath(); ctx.moveTo(a2.x, a2.y); ctx.lineTo(b2.x, b2.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawPanel3D(pn, idx) {
      var nrm = unit(cross(pn.X, pn.Y)), nn = pn.c3.length;
      var front = pn.c3.map(proj);
      var back = pn.c3.map(function (p) { return proj(add(p, mul(nrm, pn.thick))); });
      var hot = idx === hover;
      // 두께 측면(어둑하게)
      ctx.strokeStyle = hot ? ACC : FAINT; ctx.lineWidth = 1;
      ctx.fillStyle = hot ? "rgba(154,106,22,0.10)" : "rgba(26,26,28,0.05)";
      for (var e = 0; e < nn; e++) {
        var a = front[e], b = front[(e + 1) % nn], c = back[(e + 1) % nn], d = back[e];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
      // 추출 대상 큰 면(앞면)
      ctx.beginPath(); ctx.moveTo(front[0].x, front[0].y);
      for (var i = 1; i < nn; i++) ctx.lineTo(front[i].x, front[i].y);
      ctx.closePath();
      ctx.fillStyle = hot ? "rgba(154,106,22,0.16)" : FILL; ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = hot ? 1.6 : 1.1; ctx.stroke();
      // 밑변 강조(레이저 커브의 기준 = 바닥과 만나는 변)
      ctx.beginPath(); ctx.moveTo(front[0].x, front[0].y); ctx.lineTo(front[1].x, front[1].y);
      ctx.strokeStyle = ACC; ctx.lineWidth = 2.4; ctx.stroke();
    }

    function draw3D() {
      drawGround();
      var order = panels.map(function (p, i) { return { i: i, d: proj(p.cen).d }; }).sort(function (a, b) { return b.d - a.d; });
      for (var k = 0; k < order.length; k++) drawPanel3D(panels[order[k].i], order[k].i);
    }

    /* ── 2D 우측: 면 도면(레이저 커브) 밑변정렬 그리드 ── */
    function draw2D() {
      var rx0 = W * SPLIT, rw = W - rx0;
      // 분할선
      ctx.strokeStyle = "#e4e3df"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(rx0, 10); ctx.lineTo(rx0, H - 10); ctx.stroke();

      var NF = panels.length, maxW = 0, maxH = 0, i;
      for (i = 0; i < NF; i++) { if (panels[i].w > maxW) maxW = panels[i].w; if (panels[i].h > maxH) maxH = panels[i].h; }
      var sp = maxW * 0.42, cellW = maxW + sp, cellH = maxH + sp, rowGap = cellH * 0.32;
      var nRows = Math.ceil(NF / cols);
      var gridW = cols * cellW, gridH = nRows * cellH + (nRows - 1) * rowGap;
      var M = 18;
      var sc = Math.min((rw - 2 * M) / gridW, (H - 2 * M) / gridH);
      var ox = rx0 + (rw - gridW * sc) / 2, oy = (H - gridH * sc) / 2;

      for (i = 0; i < NF; i++) {
        var row = (i / cols) | 0, col = i % cols;
        var label = panels[i].label || (String.fromCharCode(65 + row) + "-" + pad2(col + 1));
        var ccx = ox + (col + 0.5) * cellW * sc;
        var ccy = oy + (row * (cellH + rowGap) + 0.5 * cellH) * sc;
        var pn = panels[i], hot = i === hover;

        ctx.save(); ctx.translate(ccx, ccy); ctx.scale(sc, -sc); // y up
        ctx.translate(0, -pn.h / 2);
        ctx.beginPath(); ctx.moveTo(pn.loc[0][0], pn.loc[0][1]);
        for (var j = 1; j < pn.loc.length; j++) ctx.lineTo(pn.loc[j][0], pn.loc[j][1]);
        ctx.closePath();
        ctx.fillStyle = hot ? "rgba(154,106,22,0.14)" : FILL; ctx.fill();
        ctx.lineWidth = (hot ? 1.7 : 1.1) / sc; ctx.strokeStyle = INK; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pn.loc[0][0], pn.loc[0][1]); ctx.lineTo(pn.loc[1][0], pn.loc[1][1]);
        ctx.lineWidth = 2.4 / sc; ctx.strokeStyle = ACC; ctx.stroke();
        ctx.restore();

        if (showLabels) {
          ctx.fillStyle = hot ? ACC : INK; ctx.font = "500 10px 'JetBrains Mono', monospace";
          ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
          ctx.fillText(label, ox + (col * cellW) * sc + 3, ccy - (cellH * 0.5) * sc - 3);
        }
      }
    }

    /* ── 캡션 ── */
    function captions() {
      ctx.font = "500 9.5px 'JetBrains Mono', monospace"; ctx.textBaseline = "top";
      ctx.fillStyle = FAINT; ctx.textAlign = "left";
      ctx.fillText(mode === "box" ? "3D · 입체 오브젝트 (드래그로 회전)" : "3D · 입체 판재 (드래그로 회전)", 10, 8);
      ctx.fillText(mode === "box" ? "2D · 면 전개도 (자동 도면화)" : "2D · 면 도면 · 레이저 커브", W * SPLIT + 10, 8);
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      ctx.lineJoin = "round";
      draw3D(); draw2D(); captions();
    }

    function status() {
      if (mode === "box") {
        statusCb("입체 1개 · 면 " + panels.length + "개 → 자동 전개도 (A~" + String.fromCharCode(64 + panels.length) + ") · 좌측 드래그로 회전");
        return;
      }
      var rows = Math.ceil(N / cols), rk = [];
      for (var i = 0; i < rows; i++) rk.push(String.fromCharCode(65 + i));
      statusCb("판재 " + N + " · 면→레이저 커브 추출 · 도면 " + rk.join(",") + " · 좌측 드래그로 회전");
    }

    function tick(ts) {
      raf = requestAnimationFrame(tick);
      var dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
      if (auto && !dragging) yaw += dt * 0.4;
      draw();
    }
    function run() { if (raf) cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(tick); }

    /* ── 인터랙션: 좌측 드래그=오빗, 호버=면 강조 ── */
    function localXY(e) {
      var r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left), (e.clientY - r.top)];
    }
    function pick(mx, my) {
      var best = -1, bd = 26 * 26;
      for (var i = 0; i < panels.length; i++) {
        var p = proj(panels[i].cen), dx = p.x - mx, dy = p.y - my, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }
    function onDown(e) { var p = localXY(e); if (p[0] < W * SPLIT) { dragging = true; lastX = p[0]; lastY = p[1]; auto = false; e.preventDefault(); } }
    function onMove(e) {
      var p = localXY(e);
      if (dragging) {
        yaw += (p[0] - lastX) * 0.01; pitch += (p[1] - lastY) * 0.01;
        if (pitch < 0.12) pitch = 0.12; if (pitch > 1.45) pitch = 1.45;
        lastX = p[0]; lastY = p[1];
      } else {
        hover = p[0] < W * SPLIT ? pick(p[0], p[1]) : -1;
      }
    }
    function onUp() { dragging = false; }
    function onLeave() { dragging = false; hover = -1; }

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onLeave);

    size(); regen(); run(); status();

    return {
      controls: [
        { type: "segmented", key: "mode", value: mode, options: [
          { value: "scatter", label: "회전 판재" },
          { value: "box", label: "입체 박스" }
        ] },
        { type: "range", key: "n", label: "판재 수", min: 3, max: 10, step: 1, value: N },
        { type: "range", key: "cols", label: "도면 열", min: 1, max: 5, step: 1, value: cols },
        { type: "toggle", key: "auto", label: "자동 회전", value: auto ? 1 : 0 },
        { type: "toggle", key: "labels", label: "라벨", value: showLabels ? 1 : 0 },
        { type: "button", key: "reseed", label: "↻ 새로 생성" }
      ],
      set: function (key, v) {
        if (key === "mode") { mode = v; regen(); }
        else if (key === "n") { N = v | 0; if (mode !== "box") genPanels(); }
        else if (key === "cols") { cols = Math.max(1, v | 0); }
        else if (key === "auto") { auto = !!v; }
        else if (key === "labels") { showLabels = !!v; }
        status();
      },
      act: function (key) { if (key === "reseed") regen(); },
      onStatus: function (fn) { statusCb = fn || function () {}; status(); },
      destroy: function () {
        if (raf) cancelAnimationFrame(raf); raf = null;
        canvas.removeEventListener("mousedown", onDown);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        canvas.removeEventListener("mouseleave", onLeave);
      }
    };
  };
})();

