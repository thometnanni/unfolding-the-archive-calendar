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
			<a href="https://www.mvrdv.com/">MVRDV</a>. It shows the time of day drawings, images,
			documents and other files have been created and emphasises periods of inactivity when set to
			group files by year, month, or day.
		</p>
		<button
			class="sticky top-4 bg-slate-700/10 rounded-full px-2 py-1 my-1 mb-4 text-slate-700 text-xs -ml-1 backdrop-blur-xs"
			onclick={() => (showMore = !showMore)}
		>
			show {showMore ? 'less' : 'more'}
		</button>

		{#if showMore}
			<p>
				Born-digital architecture archives present unique opportunities to study and interpret the
				intertwined relationship between built environment, digital cultures, and social change.
				However, due to technical limitations of the proprietary software, most of their contents
				remain inaccessible to the public at large, posing limits to both research and discovery. In
				the Dutch National Collection for Architecture and Urban Planning, where this research was
				conducted, currently as much as 60% of the collection is inaccessible.
			</p>
			<p>
				Unfolding the Archive uses select properties of Computer Aided Design (CAD) Drawing (DWG)
				and Drawing Interchange Format (DXF) as a dominant CAD file formats found in architecture
				practice from their introduction in the early 1980s throughout the 2000s. It proposes new
				conceptual approaches to access archives including CAD archival records based on their
				embedded metadata. By doing so it allows the users to form a better understanding of born
				digital archives as data, not a collection of individual files. It allows to understand the
				relationships between archival objects and better contextualise archives, providing insights
				into the structure and unique characteristics of individual collections, that are impossible
				to see with a naked eye and without specialist technical knowledge. On the most direct level
				it aims to stimulate users to engage with born digital collections on the level of relations
				and help them to identify research questions prior to requesting files. It also hopes for
				creating new insights that would otherwise only be available to researchers with highly
				technical knowledge or significant funding and through that contribute to democratisation of
				research with born digital architecture collections, making them more multivocal.
			</p>
			<p>
				Drawing from the concept of generous interfaces, <a
					href="https://unfolding-the-archive-prototypes.krisenstab.net">three prototypes</a
				> have been initially developed within this project. After careful evaluation one of the prototypes
				was selected, further refined and is now presented here.
			</p>
			<p>
				Unfolding the Archive looked at how select properties of popular Computer Aided Design (CAD)
				files – Drawing (DWG) and Drawing Interchange Format (DXF) can be used for new forms of
				access to architecture archives based on their embedded metadata. The resulting prototype
				understands born digital archives as data, not a collection of individual objects. They
				focus on visualizing the relationships between archival objects, finding ways to
				contextualise the archives by providing insights into the structure and unique
				characteristics of individual collections, that are impossible to see with a naked eye and
				without specialist technical knowledge. On the most direct level the research aimed to
				stimulate users to engage with born digital collections on the level of relations and help
				them to identify research questions prior to requesting files. It also experimented with
				different ways to create new data-driven insights that would otherwise only be available to
				researchers with highly technical knowledge or significant funding. Through that it would
				like to contribute to the democratisation of research with born digital architecture
				collections, inviting more multivocal approaches to research.
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
