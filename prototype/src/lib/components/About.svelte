<script>
	let showMore = $state()
</script>

<section class="bg-slate-200">
	<article class="prose mx-4 py-10">
		<h1>Unfolding the Archive</h1>
		<p>
			<em>
				Unfolding the Archive: New Dimensions of Access to Born-digital Architecture Collections</em
			>
			is a research project conducted by Ania Molenda at Nieuwe Instituut between 2024-2025. It explored
			how affordances of born-digital design records could improve access to contemporary architecture
			collections in ways that are dynamic and networked, multimodal, and multivocal. Born-digital architecture
			archives present unique opportunities to study and interpret the intertwined relationship between
			built environment, digital cultures, and social change. However, due to technical limitations of
			the proprietary software, most of their contents remain inaccessible to the public at large, posing
			limits to both research and discovery. In the Dutch National Collection for Architecture and Urban
			Planning, where this research was conducted, currently as much as 60% of the collection is inaccessible.
		</p>
		<button
			class="sticky top-4 bg-slate-700/10 rounded-full px-2 py-1 text-slate-700 text-xs -ml-1 backdrop-blur-xs"
			onclick={() => (showMore = !showMore)}
		>
			show {showMore ? 'less' : 'more'}
		</button>

		{#if showMore}
			<p></p>
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
				Drawing from the concept of generous interfaces, the three prototypes developed within this
				project aim to open ways for researchers to study the history of contemporary design
				practices and their social implications in ways that go beyond the structure of the
				catalogue. Through a multimodal approach, each prototype focuses on a distinct digital
				property: the creation date, the file layer structure, and the geometry information. These
				different modes were selected to test if they can enable different readings supported by
				different forms of data visualisation. This first collection of prototypes, which undeniably
				excludes many aspects due to time and scope of the research, allows to make the complexity,
				interconnectedness, non-linearity, and collaboration of the design process more visible and
				open for interpretation.
			</p>
			<p>
				The project has been supported by NWO Museum Grant in 2023. It was conducted by the Dutch
				National Collection for Architecture and Urban Planning held by at Nieuwe Instituut by Ania
				Molenda as the primary investigator and Costas Papadopulos of Maastricht University as
				academic supervisor.
			</p>
			<p>
				The prototypes were designed and developed by <a href="https://krisenstab.net/"
					>krisenstab</a
				> as part of the research project.
			</p>

			<h2>Methodology</h2>

			<p>
				<em>Unfolding the Archive</em> proposes three access prototypes created through iterative design
				sessions, where data analysis, interface and interaction design, and coding informed each other
				and were performed largely simultaneously. The prototypes test various metadata-driven interfaces
				for access to CAD records in born digital architecture archives guided by principles of de-centring
				the query-based approach, providing contextual access, displaying complexity of the archive, striving
				to surface the richness of the record, and allowing for multiple readings and interpretations.
				They surface different types of metadata separately and allow to move between modes of display
				to dive deeper into specific aspects of project dossiers or files. The prototypes allow users
				to explore the dossiers by gradually zooming into more specific information, providing an x-ray
				of sorts to look at the records through their metadata.
			</p>
			<p>
				Metadata driven interfaces provide a large degree of flexibility in what information to
				surface and allow for different ways of contextualising individual records. In this case,
				the context was limited to a project dossier, but one could imagine expanding it to a
				several project dossiers, an entire archive, or multiple archives from a collection. Because
				decontextualisation of records in born digital archives is one of the key risks identified
				by this research, the prototypes aim to propose various interpretations of contextual
				access. The proposed interfaces serve as a place of orientation, showing that archives are
				networked and relational. Objects and archives are never isolated but connected, for example
				through time, provenance, internal structures, or geometrical similarity.
			</p>
			<p>
				Providing access to archives where creative or artistic process is key, requires a different
				approach than in cases where the final result is leading. Design processes are often complex
				and do not follow a logical structure. Hence, using non-hierarchical ways of display may
				lead to making them more legible for users. Allowing users to see the contents of the
				archive through metadata allows to see beyond the intricate file organisation and bypass the
				limits of proprietary CAD software to discover them as large data sets, create new
				perspectives on their contents, and formulate more specific questions.
			</p>

			<p>
				Visualising the networked complexity of architecture archives in accessible ways remains a
				challenge both from data management and information design point of view. This project used
				a multimodal approach to surface selected types of metadata to help users navigate the
				archive from different entry points: Calendar, Layers, Geometries. Multimodality was used as
				strategy to overcome the challenge of rendering CAD records and to allow multiple readings
				and interpretations to eventually provide more multivocal perspectives. The prototypes
				developed within Unfolding the Archive aim to address users with some digital design
				literacy and aim to make the domain specific and technical knowledge easier to read and
				interpret for them.
			</p>

			<h3>Method step by step</h3>

			<p>
				<strong> Creating an inventory </strong>
				of various Computer Aided Design (CAD) file formats present in the MVRDV archive, the case study
				for this research, was the first step in the process of creating the prototypes. As analysing
				all available CAD files would exceed the scope of this research, a selection of three most dominant
				file formats was made, including DWG, DXF (both AutoCAD file formats), and FMZ (FormZ)––a legacy
				file format of large significance for the case study archive. While it was possible to establish
				a workflow to access the FMZ files and convert them into the non-legacy file format, it was not
				possible to preserve all the relevant metadata in its original form. This is why this file format
				was eventually excluded from the selection and further research.
			</p>
			<p>
				<strong> Identifying and selecting properties </strong>
				of the selected file formats was the next step. The selected properties included file name, file
				type (based on PRONOM identification), file path, file size, date created (including the time
				of creation), 2D and 3D geometry information, derived geometry data (e.g. area, convexity), and
				layers information including their names, order, color, and geometry information. As the date
				of last modification and the creation date were largely identical, using the creation date was
				prioritised, since a modification might have ocurred unintentionally. Properties identifying potential
				authorship information were excluded due to difficulty to identify the author or an editor. Software
				versions from the 90s and early 2000s that fall into the scope of this research contain little
				or no record of individual users. This has changed over the course of time and might be possible
				to retrieve for archives from more recent archives. Thumbnails were not included to make the prototype
				more readable and easy to load. Software version was deemed irrelevant for this study, as well
				as information on external reference (x-ref) and errors, as it is more relevant for archiving
				purposes than for user access.
			</p>

			<p>
				<strong> Extracting the metadata </strong>
				was directly paired with <strong>distilling and testing possible modes of display</strong>.
				Identifying relevant properties and the level of detail that could be meaningfully presented
				were the guiding principle. It was clear that working with the selected file formats and
				their metadata offerend multiple possibilities and needed to be narrowed down. Creating
				granular forms of access allowing to go deeper into the data, lead to looking for distinct
				ways of mapping selected properties in combinations that could be intriguing for the users.
				Properties could stem directly from the metadata or be derived (i.e., date and time of day
				was derived from the creation date; broader categories of files such as drawing or image
				from file extensions). Design iterations led to a choice of three modes of access based on a
				calendar view, layers view, and geometries view. Each prototype is based on plotting
				available metadata in a different type of overview that can provide new insights into the
				archival material, with a different level of detail.
			</p>
			<p>
				<strong> The Calendar View</strong> is based on temporal distribution of individual records displaying
				what types of records were cerated when and in what quantities. It provides insights in production
				spikes, shows information on work culture (i.e. 9 to 5 work model, late night shifts), but also
				project dynamics by indicating moments of inactivity (i.e. waiting for financing, consultations,
				permissions etc.). It can also provide insight into file derivatives within the archive (i.e.
				based on time proximity between two files with a similar name and a different file format), and
				on archiving activity (i.e. moving large amounts of files to a new location).
			</p>
			<p>
				<strong> Layers View </strong>allow the users to look 'under the hood' of the DWG and DXF
				files without having to render them. They allow to compare the similarity of selected CAD
				drawings by looking at the amount of recurring layers and the overlaps between the number of
				geometries they contain. It shows how layers were named and structured, and allows to see
				which layers contain most information (i.e. streets, buildings, floors, furniture, etc.),
				which can help determine the scale and type of the drawing. This prototype also allows to
				trace the occurrence of a specific layer across various files in a specific project, giving
				the possibility to follow the elements that have been copied and repeated across various
				files.
			</p>
			<p>
				<strong>Geometries</strong> View aims to create an abstracted "fingerprint" of a project by the
				geometries contained in its CAD drawings. How representative are single geometries of one project?
				How visually similar are shapes within one project and across projects?
			</p>
			<p>
				Each prototype went through several design iterations and refinements. The calendar view was
				improved for readability and compactness, the layers overview was at first too detailed and
				overwhelming, while the geometries view started of as too abstract and difficult to
				interpret. As such prototypes are not meant to be finished or perfect, but they ought to
				display what forms of access are possible and test which are meaningful to users.
				Conclusions from user testing, last step of the of this research, will be and available upon
				request and described in a research paper concluding this research.
			</p>
		{/if}
	</article>
</section>
