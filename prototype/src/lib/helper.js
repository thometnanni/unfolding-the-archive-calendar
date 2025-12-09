/**
 * Total elapsed days, month‑changes and year‑changes between two ISO‑like dates.
 *
 * @param {string} startStr – "YYYY‑MM‑DD"
 * @param {string} endStr   – "YYYY‑MM‑DD"
 * @returns {{day:number, month:number, year:number}}
 *
 *  • day   – exact calendar‑day difference (rounded)
 *  • month – how many times the month value changed while walking forward
 *  • year  – how many times the year value changed while walking forward
 *
 * The function works regardless of which date comes first – it always
 * reports positive distances.
 */
export function timeBetween(startStr, endStr) {
	if (startStr == null || endStr == null) return
	// -----------------------------------------------------------------
	// 1️⃣ Normalise both inputs to UTC midnight dates
	// -----------------------------------------------------------------
	const toUtcMidnight = (s) => new Date(`${s}T00:00:00Z`)
	let start = toUtcMidnight(startStr)
	let end = toUtcMidnight(endStr)

	// -----------------------------------------------------------------
	// 2️⃣ If the caller gave them in reverse order, flip them.
	// -----------------------------------------------------------------
	if (end < start) {
		const tmp = start
		start = end
		end = tmp
	}

	// -----------------------------------------------------------------
	// 3️⃣ Days – simple millisecond arithmetic
	// -----------------------------------------------------------------
	const MS_PER_DAY = 24 * 60 * 60 * 1000
	const day = Math.round((end - start) / MS_PER_DAY)

	// -----------------------------------------------------------------
	// 4️⃣ Pull out the individual calendar components (UTC!)
	// -----------------------------------------------------------------
	const sY = start.getUTCFullYear()
	const sM = start.getUTCMonth() // 0‑based (Jan = 0)
	const eY = end.getUTCFullYear()
	const eM = end.getUTCMonth()

	// -----------------------------------------------------------------
	// 5️⃣ Months – count every month boundary that is crossed.
	//    This is simply the raw month distance, no day‑adjustment.
	// -----------------------------------------------------------------
	const month = (eY - sY) * 12 + (eM - sM)

	// -----------------------------------------------------------------
	// 6️⃣ Years – count every year boundary that is crossed.
	// -----------------------------------------------------------------
	const year = eY - sY

	// -----------------------------------------------------------------
	// 7️⃣ Return the three independent totals
	// -----------------------------------------------------------------
	return { day, month, year }
}

export function getColorFromFileType(fileType) {
	switch (fileType) {
		case 'drawing':
			return '#27D5C6'
		case 'image':
			return '#EA6CEA'
		case 'document':
			return '#F0BD65'
		default:
			return '#4A4D5F'
	}
}

export function isSameBin(d1, d2, granularity) {
	if (d1 == null || d2 == null) return false
	if (granularity === 'all') return true
	if (granularity === 'year') return d1.replace(/-.*/, '') === d2.replace(/-.*/, '')
	if (granularity === 'month') return d1.replace(/-.{2}$/, '') === d2.replace(/-.{2}$/, '')
	return d1 === d2
}

/**
 * Linear interpolation between two numbers.
 *
 * @param {number} a - Start value.
 * @param {number} b - End value.
 * @param {number} t - Interpolation factor (0 ≤ t ≤ 1).
 * @returns {number} The interpolated value.
 */
export function lerp(a, b, t) {
	return a + (b - a) * t
}
