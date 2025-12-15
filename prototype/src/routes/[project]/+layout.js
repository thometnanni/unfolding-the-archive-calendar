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

	return { projects, margin }
}
