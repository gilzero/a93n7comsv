<script lang="ts">
	import { onMount } from 'svelte';

	// State Management
	let activeNodeIndex = $state(-1); // Start with no node active
	let currentIteration = $state(0); // To alternate branches

	const nodes = [
		{ id: 0, name: 'Data Ingestion', icon: 'DI' },
		{ id: 1, name: 'Intelligent Triage & Classification', icon: 'AI1' },
		{ id: 2, name: 'Automated Data Entry', icon: 'RPA1A' }, // Branch A
		{ id: 3, name: 'Information Enrichment', icon: 'RPA1B' }, // Branch B
		{ id: 4, name: 'Validation & Quality Check', icon: 'AI2' },
		{ id: 5, name: 'Process Completion & Reporting', icon: 'RPA3' }, // Corrected from RPA2
		{ id: 6, name: 'Optimized Outcome', icon: 'EO' },
	];

	// Defines the sequence of node IDs to activate.
	// Sequence 0: Start -> AI1 -> RPA1A -> AI2 -> RPA3 -> End
	// Sequence 1: Start -> AI1 -> RPA1B -> AI2 -> RPA3 -> End
	const sequences = [
		[0, 1, 2, 4, 5, 6], // Path via RPA1A
		[0, 1, 3, 4, 5, 6], // Path via RPA1B
	];

	let currentPathStep = $state(0); // Index within the current sequence

	// SVG Icons (simple placeholders, replace with actual SVGs if available or from a library)
	// Using Heroicons-like simple paths for demonstration
	const icons: Record<string, string> = {
		DI: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" /></svg>`, // Arrow Down Tray
		AI1: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>`, // Light Bulb
		RPA1A: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>`, // Pencil Square
		RPA1B: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`, // Arrows Right Left
		AI2: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`, // Check Circle
		RPA3: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`, // Document Check
		EO: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3 3 0 0012 9.75A3 3 0 007.5 14.25v4.5m4.5-4.5v4.5m0-4.5H12m0 0h.375m-.375 0H12m0 0h-.375m.375 0H12m0 0V9.75M12 9.75A2.25 2.25 0 009.75 7.5M12 9.75A2.25 2.25 0 0114.25 7.5M12 9.75c0 .896.393 1.7.997 2.25M12 9.75c0 .896-.393 1.7-.997 2.25M12 7.5c0 .896.393 1.7.997 2.25M12 7.5c0 .896-.393 1.7-.997 2.25M12 7.5V4.875c0-.621-.504-1.125-1.125-1.125H9.75M12 7.5V4.875c0-.621.504-1.125 1.125-1.125h2.25" /></svg>`, // Trophy
	};

	// Animation Logic
	onMount(() => {
		const interval = setInterval(() => {
			const currentSequencePath = sequences[currentIteration % sequences.length];

			activeNodeIndex = currentSequencePath[currentPathStep];

			currentPathStep++;
			if (currentPathStep >= currentSequencePath.length) {
				currentPathStep = 0;
				currentIteration++; // Move to next iteration to alternate branch
				activeNodeIndex = -1; // Briefly turn off all nodes before starting next cycle
			}
		}, 2000); // Change active node every 2 seconds

		return () => clearInterval(interval); // Cleanup on component destroy
	});

	function isNodeActive(nodeId: number): boolean {
		return activeNodeIndex === nodeId;
	}

	function isConnectorActive(fromNodeId: number, toNodeId: number): boolean {
		if (activeNodeIndex === -1) return false;

		const currentSequencePath = sequences[currentIteration % sequences.length];
		const activeNodeInCurrentPath = currentSequencePath[currentPathStep -1] // current active node is step -1 as currentPathStep has already incremented

		if (activeNodeInCurrentPath === undefined && currentPathStep === 0 && activeNodeIndex === currentSequencePath[0]) {
			// Special case: first node is active, no connector leads to it yet in this step based on fromNodeId
			return false;
		}

		// A connector is active if it's between the previously active node and the current target node
		// This logic needs to be robust for branching
		const currentActivePathNodeIndexInSequence = currentSequencePath.indexOf(activeNodeIndex);
		if (currentActivePathNodeIndexInSequence > 0) {
			const previousNodeInSequence = currentSequencePath[currentActivePathNodeIndexInSequence -1];
			return previousNodeInSequence === fromNodeId && activeNodeIndex === toNodeId;
		}
		return false;
	}

	// Helper to get node object by ID
	function getNode(id: number) {
		return nodes.find(n => n.id === id);
	}

</script>

<div class="interactive-flowchart-container bg-gray-100 p-8 rounded-lg shadow-md" role="figure" aria-labelledby="flowchart-title">
	<h2 id="flowchart-title" class="sr-only">Interactive Process Flowchart</h2> {/* Screen-reader only title */}
	<div class="flex flex-col items-center"> {/* Removed space-y-8 to control spacing with connectors */}

		<!-- Start Node (ID 0) -->
		<div
			class="node bg-white p-4 rounded-lg shadow-lg w-64 text-center border-2"
			class:border-yellow-500={isNodeActive(0)}
			class:shadow-yellow-300={isNodeActive(0)}
			class:shadow-xl={isNodeActive(0)}
			class:border-gray-300={!isNodeActive(0)}
		>
			<div class="icon-container h-8 w-8 mx-auto mb-2" class:text-yellow-500={isNodeActive(0)} class:text-gray-500={!isNodeActive(0)} aria-hidden="true">
				{@html icons[nodes[0].icon]}
			</div>
			<h3 class="text-md font-semibold text-gray-800">{nodes[0].name}</h3>
		</div>

		<!-- Connector 0 -> 1 -->
		<div class="connector-line h-10 w-1 my-1" class:bg-yellow-500={isConnectorActive(0,1)} class:bg-gray-400={!isConnectorActive(0,1)}></div>

		<!-- AI Decision 1 (ID 1) -->
		<div
			class="node bg-purple-100 p-4 rounded-lg shadow-lg w-72 text-center border-2"
			class:border-yellow-500={isNodeActive(1)}
			class:shadow-yellow-300={isNodeActive(1)}
			class:shadow-xl={isNodeActive(1)}
			class:border-purple-300={!isNodeActive(1)}
		>
			<div class="icon-container h-8 w-8 mx-auto mb-2" class:text-yellow-500={isNodeActive(1)} class:text-purple-500={!isNodeActive(1)} aria-hidden="true">
				{@html icons[nodes[1].icon]}
			</div>
			<h3 class="text-md font-semibold text-purple-800">{nodes[1].name}</h3>
		</div>

		<!-- Connector 1 -> 2 (Branch A) / 1 -> 3 (Branch B) -->
		<div class="connector-line h-10 w-1 my-1" class:bg-yellow-500={isConnectorActive(1,2) || isConnectorActive(1,3)} class:bg-gray-400={!(isConnectorActive(1,2) || isConnectorActive(1,3))}></div>

		<!-- Branching for RPA Actions -->
		<div class="flex space-x-16 relative my-1"> {/* Added relative and my-1 */}
			<!-- Branch A Path -->
			<div class="flex flex-col items-center">
				<!-- RPA Action 1 (Branch A - ID 2) -->
				<div
					class="node bg-blue-100 p-4 rounded-lg shadow-lg w-64 text-center border-2"
					class:border-yellow-500={isNodeActive(2)}
					class:shadow-yellow-300={isNodeActive(2)}
					class:shadow-xl={isNodeActive(2)}
					class:border-blue-300={!isNodeActive(2)}
				>
					<div class="icon-container h-8 w-8 mx-auto mb-2" class:text-yellow-500={isNodeActive(2)} class:text-blue-500={!isNodeActive(2)} aria-hidden="true">
						{@html icons[nodes[2].icon]}
					</div>
					<h3 class="text-md font-semibold text-blue-800">{nodes[2].name}</h3>
				</div>
			</div>

			<!-- Branch B Path -->
			<div class="flex flex-col items-center">
				<!-- RPA Action 2 (Branch B - ID 3) -->
				<div
					class="node bg-blue-100 p-4 rounded-lg shadow-lg w-64 text-center border-2"
					class:border-yellow-500={isNodeActive(3)}
					class:shadow-yellow-300={isNodeActive(3)}
					class:shadow-xl={isNodeActive(3)}
					class:border-blue-300={!isNodeActive(3)}
				>
					<div class="icon-container h-8 w-8 mx-auto mb-2" class:text-yellow-500={isNodeActive(3)} class:text-blue-500={!isNodeActive(3)} aria-hidden="true">
						{@html icons[nodes[3].icon]}
					</div>
					<h3 class="text-md font-semibold text-blue-800">{nodes[3].name}</h3>
				</div>
			</div>
		</div>

		<!-- Converging Connectors to AI Decision 2 (ID 4) -->
		<!-- This part remains a simplified placeholder. Proper SVG connectors would be needed for a polished look. -->
		<div class="flex justify-center items-center h-10 w-full my-1 relative"> {/* Added relative and my-1 */}
			<div class="absolute top-0 left-1/2 transform -translate-x-1/2">
				<!-- Connector from RPA1A (2) to AI2 (4) -->
				<div
					class="h-10 w-1 origin-bottom transform"
					class:bg-yellow-500={isConnectorActive(2,4)}
					class:bg-gray-400={!isConnectorActive(2,4)}
					style:transform={isNodeActive(2) || isNodeActive(4) ? "rotate(-30deg) translateX(-2px)" : "rotate(0deg)"}
				></div>
			</div>
			<div class="absolute top-0 left-1/2 transform -translate-x-1/2">
				<!-- Connector from RPA1B (3) to AI2 (4) -->
				<div
					class="h-10 w-1 origin-bottom transform"
					class:bg-yellow-500={isConnectorActive(3,4)}
					class:bg-gray-400={!isConnectorActive(3,4)}
					style:transform={isNodeActive(3) || isNodeActive(4) ? "rotate(30deg) translateX(2px)" : "rotate(0deg)"}
				></div>
			</div>
		</div>


		<!-- AI Decision 2 (ID 4) -->
		<div
			class="node bg-purple-100 p-4 rounded-lg shadow-lg w-72 text-center border-2"
			class:border-yellow-500={isNodeActive(4)}
			class:shadow-yellow-300={isNodeActive(4)}
			class:shadow-xl={isNodeActive(4)}
			class:border-purple-300={!isNodeActive(4)}
		>
			<div class="icon-container h-8 w-8 mx-auto mb-2" class:text-yellow-500={isNodeActive(4)} class:text-purple-500={!isNodeActive(4)} aria-hidden="true">
				{@html icons[nodes[4].icon]}
			</div>
			<h3 class="text-md font-semibold text-purple-800">{nodes[4].name}</h3>
		</div>

		<!-- Connector 4 -> 5 -->
		<div class="connector-line h-10 w-1 my-1" class:bg-yellow-500={isConnectorActive(4,5)} class:bg-gray-400={!isConnectorActive(4,5)}></div>

		<!-- RPA Action 3 (ID 5) - Corrected from RPA2 -->
		<div
			class="node bg-blue-100 p-4 rounded-lg shadow-lg w-64 text-center border-2"
			class:border-yellow-500={isNodeActive(5)}
			class:shadow-yellow-300={isNodeActive(5)}
			class:shadow-xl={isNodeActive(5)}
			class:border-blue-300={!isNodeActive(5)}
		>
			<div class="icon-container h-8 w-8 mx-auto mb-2" class:text-yellow-500={isNodeActive(5)} class:text-blue-500={!isNodeActive(5)} aria-hidden="true">
				{@html icons[nodes[5].icon]}
			</div>
			<h3 class="text-md font-semibold text-blue-800">{nodes[5].name}</h3>
		</div>

		<!-- Connector 5 -> 6 -->
		<div class="connector-line h-10 w-1 my-1" class:bg-yellow-500={isConnectorActive(5,6)} class:bg-gray-400={!isConnectorActive(5,6)}></div>

		<!-- End Node (ID 6) -->
		<div
			class="node bg-green-100 p-4 rounded-lg shadow-lg w-64 text-center border-2"
			class:border-yellow-500={isNodeActive(6)}
			class:shadow-yellow-300={isNodeActive(6)}
			class:shadow-xl={isNodeActive(6)}
			class:border-green-300={!isNodeActive(6)}
		>
			<div class="icon-container h-8 w-8 mx-auto mb-2" class:text-yellow-500={isNodeActive(6)} class:text-green-500={!isNodeActive(6)} aria-hidden="true">
				{@html icons[nodes[6].icon]}
			</div>
			<h3 class="text-md font-semibold text-green-800">{nodes[6].name}</h3>
		</div>
	</div>
</div>

<style>
	/* Tailwind class for screen-reader only: */
	/* .sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	} */
	.node {
		transition: transform 0.3s ease-in-out, border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
	}
	/* No specific hover transform when active animation is running to avoid conflict */
	/* .node:hover {
		transform: translateY(-5px);
	} */

	.icon-container > svg { /* Ensure direct SVG child is targeted */
		width: 100%;
		height: 100%;
		transition: color 0.3s ease-in-out;
	}

	.connector-line {
		transition: background-color 0.3s ease-in-out;
	}
	/* Converging connector styling is very basic and needs significant improvement, ideally with SVG.
	   The current attempt with rotated divs is a placeholder. */
	.connector-converge-arm {
		transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
	}
</style>
