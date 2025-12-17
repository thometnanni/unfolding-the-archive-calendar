import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
	const res = await fetch(`projects/directories.json`)

	if (!res.ok) {
		throw error(res.status, {
			message: res.statusText
		})
	}

	const projects = await res.json()

	const margin = {
		top: 25,
		right: 25,
		bottom: 25,
		left: 25
	}

	const colors = {
		drawing: 'var(--color-teal-500)',
		image: 'var(--color-fuchsia-500)',
		document: 'var(--color-amber-500)',
		other: 'var(--color-slate-500)'
	}

	return { projects, margin, colors }
}
