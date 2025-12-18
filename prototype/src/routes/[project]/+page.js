import { error } from '@sveltejs/kit'

export async function load({ params, fetch }) {
	const res = await fetch(`projects/${params.project}.json`)

	if (!res.ok) {
		throw error(res.status, {
			message: res.statusText
		})
	}

	const project = await res.json()

	return { project }
}

export async function entries() {
	const { default: directories } = await import('../../../static/projects/directories.json')

	return directories.map(({ name }) => ({ project: name }))
}

export const prerender = true
