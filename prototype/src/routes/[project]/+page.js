import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const res = await fetch(`data/${params.project}`);

	if (!res.ok) {
		throw error(res.status, {
			message: res.statusText
		});
	}

	const project = await res.json();

	console.log(project);
	return { project };
}
