const proxyUrl = "api";
let miRefreshInterval,
  wiRefreshInterval,
  datatable,
  datatable2,
  workers = [],
  naworkers = [];
function fetchGet(t, e) {
  fetch(t, { method: "GET" })
    .then((t) => {
      if (!t.ok) throw new Error("Network response was not ok");
      return t.json();
    })
    .then(e)
    .catch((t) => {
      console.error("Error fetching data:", t);
    });
}
function formatDate(t) {
  if (t <= 0) return "N/A";
  const e = (Math.round(new Date().getTime()) - t) / 1e3,
    a = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"],
    r = [31536e3, 2592e3, 604800, 86400, 3600, 60, 1];
  for (let t = 0; t < a.length; t++) {
    const s = Math.floor(e / r[t]);
    if (s > 0) return `${s} ${a[t]} ago`;
  }
  return "N/A";
}
function handleMainInfo(t) {
  if (!(t && "object" == typeof t && Object.keys(t).length > 0)) return;
  const e = t.results,
    a = t.hashrate.total;
  $("#hashrate").text(a[0] + " Kh/s"),
    $("#hashrate10m").text(a[1] + " Kh/s"),
    $("#hashrate1h").text(a[2] + " Kh/s"),
    $("#hashrate12h").text(a[3] + " Kh/s"),
    $("#hashrate24h").text(a[4] + " Kh/s"),
    $("#hashrate-all").text(a[5] + " Kh/s");
  const r = e.accepted,
    s = e.accepted + e.rejected + e.invalid;
  $("#acceptedshares").text(`${r} / ${s} (${((r / s) * 100).toFixed(2)}%)`),
    $("#hashes").text(e.hashes_total.toLocaleString()),
    $("#time").text((t.uptime / 3600).toFixed(2) + " hours"),
    $("#mode").text(`${t.mode}`),
    $("#latency").text(`Ping: ${e.latency} ms`),
    $("#avg_time").text(`Avg: ${e.avg_time} s`),
    $("#best").text(`Best: ${e.best[0].toLocaleString()}`),
    $("#effort").text(`${((e.hashes_total / e.best[0]) * 100).toFixed(2)}%`),
    $("#version").text(`${t.version}`);
}
function handleWorkersInfo(t) {
  if (!(t && "object" == typeof t && Object.keys(t).length > 0)) return;
  (workers = []), (naworkers = []);
  let e = 0,
    a = 0;
  t.workers.forEach((t) => {
    const r = [
      t[0].length > 30
        ? `<span data-toggle="tooltip" data-placement="top" title="${
            t[0]
          }">${t[0].substr(0, 30)}...</span>`
        : t[0],
      `${t[1]}`,
      `${t[3]}/${t[4]}/${t[5]}`,
      `${t[8]} Kh/s`,
      `${t[9]} Kh/s`,
      `${t[10]} Kh/s`,
      `${t[11]} Kh/s`,
      `${t[12]} Kh/s`,
      formatDate(t[7]),
    ];
    parseInt(t[2]) > 0
      ? (parseInt(t[2]) > 1 && (r[0] += ` x${t[2]}`), workers.push(r), e++)
      : (naworkers.push(r), a++);
  }),
    $("#allworkers").text(e + a),
    $("#activeworkers").text(e),
    $("#notactiveworkers").text(a),
    fillTables();
}
function fetchMainInfo() {
  fetchGet(`${proxyUrl}?action=summary`, handleMainInfo);
}
function fetchWorkersInfo() {
  fetchGet(`${proxyUrl}?action=workers`, handleWorkersInfo);
}
function fillTables() {
  null !== datatable &&
    "object" == typeof datatable &&
    datatable.clear().rows.add(workers).draw(),
    null !== datatable2 &&
      "object" == typeof datatable2 &&
      datatable2.clear().rows.add(naworkers).draw();
}
$(document).ready(() => {
  fetchMainInfo(),
    fetchWorkersInfo(),
    (datatable = $("#workerstable").DataTable({
      data: workers,
      columns: [
        { title: "Name", className: "table-center" },
        { title: "IP", width: "10%", className: "table-right" },
        { title: "Shares", width: "10%", className: "table-right" },
        { title: "Hashrate 1m", width: "10%", className: "table-right" },
        { title: "Hashrate 10m", width: "10%", className: "table-right" },
        { title: "Hashrate 1h", width: "10%", className: "table-right" },
        { title: "Hashrate 12h", width: "10%", className: "table-right" },
        { title: "Hashrate 24h", width: "10%", className: "table-right" },
        { title: "Last Hash", width: "10%", className: "table-right" },
      ],
      order: [[0, "desc"]],
      scrollY: "7.7rem",
    })),
    (datatable2 = $("#naworkerstable").DataTable({
      data: naworkers,
      columns: [
        { title: "Name", className: "table-center" },
        { title: "IP", width: "10%", className: "table-right" },
        { title: "Shares", width: "10%", className: "table-right" },
        { title: "Hashrate 1m", width: "10%", className: "table-right" },
        { title: "Hashrate 10m", width: "10%", className: "table-right" },
        { title: "Hashrate 1h", width: "10%", className: "table-right" },
        { title: "Hashrate 12h", width: "10%", className: "table-right" },
        { title: "Hashrate 24h", width: "10%", className: "table-right" },
        { title: "Last Hash", width: "10%", className: "table-right" },
      ],
      order: [[0, "desc"]],
      scrollY: "7.7rem",
    }));
});
