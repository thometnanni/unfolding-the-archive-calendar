<script>
	let showMore = $state()
</script>

<section class="bg-slate-200">
	<article class="mx-2 py-1 text-black max-w-[640px] prose leading-tight [&_h1]:my-1 [&_p]:my-2">
		<h1 class="font-normal text-4xl">Unfolding the Archive</h1>
		<p class="font-base">
			<em>Unfolding the Archive</em> is a research project conducted by
			<a href="https://www.aniamolenda.com/">Ania Molenda</a>
			at <a href="https://nieuweinstituut.nl/en">Nieuwe Instituut</a>
			between 2024-2025. It explores how metadata of born-digital design records can reveal new ways of
			understanding and exploring architectural practice.
		</p>
		<p class="my-2">
			This visualisation was created by
			<a href="https://krisenstab.net/">Krisenstab</a> and displays 14 projects by
			<a href="https://www.mvrdv.com/">MVRDV</a>. It shows when drawings, images, documents and
			other files have been created. Through yearly, monthly, or daily overviews it traces the
			periods of high activity in the file creation as well as moments when things fell still. It
			allows to browse the archive by following the dynamics of the digital design process.
		</p>
		<button
			class="cursor-pointer sticky top-4 bg-slate-700/10 rounded-full px-2 py-1 my-1 mb-4 text-slate-700 text-xs -ml-1 backdrop-blur-xs"
			onclick={() => (showMore = !showMore)}
		>
			show {showMore ? 'less' : 'more'}
		</button>

		{#if showMore}
			<p>
				Drawing from the concept of generous interfaces by Mitchel Whitelaw, <a
					href="https://unfolding-the-archive-prototypes.krisenstab.net">three prototypes</a
				> have been developed within Unfolding the Archive. Based on the results of user-testing, the
				calendar view was selected, further refined and is now presented here.
			</p>
			<p>
				The calendar view is based on a temporal distribution of individual records. It displays
				what types of records were cerated (drawing, image, document, other) when. It provides
				insights in production spikes, shows information on work culture (i.e. 9 to 5 work model,
				late night shifts), but also project dynamics by indicating moments of inactivity (i.e.
				waiting for financing, consultations, permissions, other work etc.). It allows to pinpoint
				potential derivatives within the archive (i.e. based on time proximity between two files
				with a similar name and a different file format), and sheds light on archiving (i.e. moving
				large amounts of files to a new location).
			</p>
			<p>
				Unfolding the Archive looked at how select properties of popular Computer Aided Design (CAD)
				files – Drawing (DWG) and Drawing Interchange Format (DXF) can be accessed based on their
				embedded metadata. The resulting prototypes understand born digital archives as data, not a
				collection of individual objects. They focus on visualizing the relationships between
				archival objects and provide insights into the characteristics of individual collections,
				which are often invisible.
			</p>
			<p>
				Born-digital architecture archives present unique opportunities to study and interpret the
				intertwined relationship between built environment, digital cultures, and social change.
				However, due to technical limitations most of their contents remain inaccessible to the
				public at large, posing limits to both research and discovery. In the Dutch National
				Collection for Architecture and Urban Planning, where this research was conducted, currently
				as much as 60% of the born digital collection is inaccessible. By developing conceptual
				approaches and prototypes, this research demonstrates how relational and experimental
				interfaces can visualize connections between archival objects, stimulate early-stage
				research, and democratize access to born-digital architecture collections. In this way it
				aims to invite new and more unexpected approaches to research.
			</p>
			<p>
				The project has been supported by NWO Museum Grant in 2023. It was conducted by the Dutch
				National Collection for Architecture and Urban Planning held by at Nieuwe Instituut by Ania
				Molenda as the primary investigator and Costas Papadopulos of Maastricht University as
				academic supervisor.
			</p>
		{/if}
	</article>
</section>
