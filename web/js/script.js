const proxyUrl = "php/api.php";

let miRefreshInterval,
  wiRefreshInterval,
  datatable,
  datatable2,
  workers = [],
  naworkers = [];

function fetchGet(url, callback) {
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(callback)
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function formatDate(timestamp) {
  if (timestamp <= 0) return "N/A";

  const mistiming = (Math.round(new Date().getTime()) - timestamp) / 1000;
  const intervals = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
  ];
  const secondsInInterval = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

  for (let i = 0; i < intervals.length; i++) {
    const inm = Math.floor(mistiming / secondsInInterval[i]);
    if (inm > 0) return `${inm} ${intervals[i]} ago`;
  }
  return "N/A";
}

function handleMainInfo(data) {
  if (!(data && typeof data === "object" && Object.keys(data).length > 0))
    return;

  const results = data.results;
  const hashrate = data.hashrate.total;

  $("#hashrate").text(hashrate[0] + " Kh/s");
  $("#hashrate10m").text(hashrate[1] + " Kh/s");
  $("#hashrate1h").text(hashrate[2] + " Kh/s");
  $("#hashrate12h").text(hashrate[3] + " Kh/s");
  $("#hashrate24h").text(hashrate[4] + " Kh/s");
  $("#hashrate-all").text(hashrate[5] + " Kh/s");

  const accepted = results.accepted;
  const totalShares = results.accepted + results.rejected + results.invalid;
  $("#acceptedshares").text(
    `${accepted} / ${totalShares} (${((accepted / totalShares) * 100).toFixed(
      2
    )}%)`
  );

  $("#hashes").text(results.hashes_total.toLocaleString());
  $("#time").text((data.uptime / 3600).toFixed(2) + " hours");
  $("#mode").text(`${data.mode}`);
  $("#latency").text(`Ping: ${results.latency} ms`);
  $("#avg_time").text(`Avg: ${results.avg_time} s`);
  $("#best").text(`Best: ${results.best[0].toLocaleString()}`);
  $("#effort").text(
    `${((results.hashes_total / results.best[0]) * 100).toFixed(2)}%`
  );
  $("#version").text(`${data.version}`);
}

function handleWorkersInfo(data) {
  if (!(data && typeof data === "object" && Object.keys(data).length > 0))
    return;

  workers = [];
  naworkers = [];

  let aworkerscount = 0,
    naworkerscount = 0;

  data.workers.forEach((worker) => {
    const name =
      worker[0].length > 30
        ? `<span data-toggle="tooltip" data-placement="top" title="${
            worker[0]
          }">${worker[0].substr(0, 30)}...</span>`
        : worker[0];

    const workdata = [
      name,
      `${worker[1]}`,
      `${worker[3]}/${worker[4]}/${worker[5]}`,
      `${worker[8]} Kh/s`,
      `${worker[9]} Kh/s`,
      `${worker[10]} Kh/s`,
      `${worker[11]} Kh/s`,
      `${worker[12]} Kh/s`,
      formatDate(worker[7]),
    ];

    if (parseInt(worker[2]) > 0) {
      if (parseInt(worker[2]) > 1) workdata[0] += ` x${worker[2]}`;
      workers.push(workdata);
      aworkerscount++;
    } else {
      naworkers.push(workdata);
      naworkerscount++;
    }
  });

  $("#allworkers").text(aworkerscount + naworkerscount);
  $("#activeworkers").text(aworkerscount);
  $("#notactiveworkers").text(naworkerscount);

  fillTables();
}

function fetchMainInfo() {
  fetchGet(`${proxyUrl}?action=summary`, handleMainInfo);
  miRefreshInterval = setInterval(
    () => fetchGet(`${proxyUrl}?action=summary`, handleMainInfo),
    60000
  );
}

function fetchWorkersInfo() {
  fetchGet(`${proxyUrl}?action=workers`, handleWorkersInfo);
  wiRefreshInterval = setInterval(
    () => fetchGet(`${proxyUrl}?action=workers`, handleWorkersInfo),
    60000
  );
}

function fillTables() {
  if (datatable !== null && typeof datatable === "object") {
    datatable.clear().rows.add(workers).draw();
  }

  if (datatable2 !== null && typeof datatable2 === "object") {
    datatable2.clear().rows.add(naworkers).draw();
  }
}

$(document).ready(() => {
  fetchMainInfo();
  fetchWorkersInfo();

  datatable = $("#workerstable").DataTable({
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
    order: [[1, "desc"]],
  });

  datatable2 = $("#naworkerstable").DataTable({
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
    order: [[1, "desc"]],
  });
});
