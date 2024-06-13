const autoRefresh = true; // Set this to true to enable auto-refresh
const refreshInterval = 60000; // Refresh interval in milliseconds (e.g., 60000 ms = 1 minute)

let activeWorkersTable,
	inactiveWorkersTable,
	activeWorkersData = [],
	inactiveWorkersData = [];

function fetchData(url, callback) {
	fetch(url, { method: 'GET' })
		.then((response) => {
			if (!response.ok) throw new Error('Network response was not ok');
			return response.json();
		})
		.then(callback)
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
}

function timeAgo(timestamp) {
	if (timestamp <= 0) return 'N/A';
	const secondsElapsed = (Math.round(new Date().getTime()) - timestamp) / 1000,
		timeUnits = [
			'years',
			'months',
			'weeks',
			'days',
			'hours',
			'minutes',
			'seconds',
		],
		timeDurations = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
	for (let i = 0; i < timeUnits.length; i++) {
		const duration = Math.floor(secondsElapsed / timeDurations[i]);
		if (duration > 0) return `${duration} ${timeUnits[i]} ago`;
	}
	return 'N/A';
}

function updateSummary(data) {
	if (!(data && typeof data === 'object' && Object.keys(data).length > 0))
		return;
	const results = data.results,
		totalHashrate = data.hashrate.total;

	$('#hashrate').text(totalHashrate[0] + ' Kh/s');
	$('#hashrate10m').text(totalHashrate[1] + ' Kh/s');
	$('#hashrate1h').text(totalHashrate[2] + ' Kh/s');
	$('#hashrate12h').text(totalHashrate[3] + ' Kh/s');
	$('#hashrate24h').text(totalHashrate[4] + ' Kh/s');
	$('#hashrate-all').text(totalHashrate[5] + ' Kh/s');

	const acceptedShares = results.accepted,
		totalShares = results.accepted + results.rejected + results.invalid;

	$('#acceptedshares').text(
		`${acceptedShares} / ${totalShares} (${(
			(acceptedShares / totalShares) *
			100
		).toFixed(2)}%)`
	);
	$('#hashes').text(results.hashes_total.toLocaleString());
	$('#time').text((data.uptime / 3600).toFixed(2) + ' hours');
	$('#mode').text(`${data.mode}`);
	$('#latency').text(`Ping: ${results.latency} ms`);
	$('#avg_time').text(`Avg: ${results.avg_time} s`);
	$('#best').text(`Best: ${results.best[0].toLocaleString()}`);
	$('#effort').text(
		`${((results.hashes_total / results.best[0]) * 100).toFixed(2)}%`
	);
	$('#version').text(`${data.version}`);
}

function updateWorkers(data) {
	if (!(data && typeof data === 'object' && Object.keys(data).length > 0))
		return;
	activeWorkersData = [];
	inactiveWorkersData = [];
	let activeCount = 0,
		inactiveCount = 0;

	data.workers.forEach((worker) => {
		const workerInfo = [
			worker[0].length > 30
				? `<span data-toggle="tooltip" data-placement="top" title="${
						worker[0]
				  }">${worker[0].substr(0, 30)}...</span>`
				: worker[0],
			`${worker[1]}`,
			`${worker[3]}/${worker[4]}/${worker[5]}`,
			`${worker[8]} Kh/s`,
			`${worker[9]} Kh/s`,
			`${worker[10]} Kh/s`,
			`${worker[11]} Kh/s`,
			`${worker[12]} Kh/s`,
			timeAgo(worker[7]),
		];
		if (parseInt(worker[2]) > 0) {
			if (parseInt(worker[2]) > 1) workerInfo[0] += ` x${worker[2]}`;
			activeWorkersData.push(workerInfo);
			activeCount++;
		} else {
			inactiveWorkersData.push(workerInfo);
			inactiveCount++;
		}
	});

	$('#allworkers').text(activeCount + inactiveCount);
	$('#activeworkers').text(activeCount);
	$('#notactiveworkers').text(inactiveCount);

	if (activeWorkersTable !== null && typeof activeWorkersTable === 'object') {
		activeWorkersTable.clear().rows.add(activeWorkersData).draw();
	}
	if (
		inactiveWorkersTable !== null &&
		typeof inactiveWorkersTable === 'object'
	) {
		inactiveWorkersTable.clear().rows.add(inactiveWorkersData).draw();
	}
}

function fetchSummary() {
	fetchData('api/summary', updateSummary);
}

function fetchWorkers() {
	fetchData('api/workers', updateWorkers);
}

function setupAutoRefresh() {
	if (autoRefresh) {
		setInterval(() => {
			fetchSummary();
			fetchWorkers();
		}, refreshInterval);
	}
}

$(document).ready(() => {
	fetchSummary();
	fetchWorkers();
	setupAutoRefresh();

	activeWorkersTable = $('#workerstable').DataTable({
		data: activeWorkersData,
		columns: [
			{ title: 'Name', className: 'table-center' },
			{ title: 'IP', width: '10%', className: 'table-right' },
			{ title: 'Shares', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 1m', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 10m', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 1h', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 12h', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 24h', width: '10%', className: 'table-right' },
			{ title: 'Last Hash', width: '10%', className: 'table-right' },
		],
		order: [[0, 'desc']],
		scrollY: '7.7rem',
	});

	inactiveWorkersTable = $('#naworkerstable').DataTable({
		data: inactiveWorkersData,
		columns: [
			{ title: 'Name', className: 'table-center' },
			{ title: 'IP', width: '10%', className: 'table-right' },
			{ title: 'Shares', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 1m', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 10m', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 1h', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 12h', width: '10%', className: 'table-right' },
			{ title: 'Hashrate 24h', width: '10%', className: 'table-right' },
			{ title: 'Last Hash', width: '10%', className: 'table-right' },
		],
		order: [[0, 'desc']],
		scrollY: '7.7rem',
	});
});
