import { redirect } from '@sveltejs/kit'
import directories from '../../static/projects/directories.json'

export function load() {
	redirect(308, directories[0].name)
}
