<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let mounted = $state(false);
	let heroText = $state('A93N7');
	let isTransformed = $state(false);
	let particles: Array<{x: number, y: number, size: number, opacity: number}> = $state([]);
	
	const morphProgress = tweened(0, {
		duration: 1500,
		easing: cubicOut
	});

	onMount(() => {
		mounted = true;
		
		// Create particles for background
		for (let i = 0; i < 50; i++) {
			particles.push({
				x: Math.random() * 100,
				y: Math.random() * 100,
				size: Math.random() * 4 + 1,
				opacity: Math.random() * 0.3 + 0.1
			});
		}

		// Auto-transform after delay
		setTimeout(() => {
			transformText();
		}, 2000);

		// Continuous transformation loop
		setInterval(() => {
			transformText();
		}, 6000);
	});

	function transformText() {
		if (!isTransformed) {
			morphProgress.set(1);
			setTimeout(() => {
				heroText = 'AgENT';
				isTransformed = true;
			}, 750);
		} else {
			morphProgress.set(0);
			setTimeout(() => {
				heroText = 'A93N7';
				isTransformed = false;
			}, 750);
		}
	}

	function handleHeroClick() {
		transformText();
	}
</script>

<svelte:head>
	<title>A93N7 - Agentic AI Meets Automation</title>
	<meta name="description" content="A93N7 represents the future of hyperautomation where artificial intelligence meets robotic process automation." />
</svelte:head>

<main class="min-h-screen bg-gray-50 text-gray-900 overflow-hidden relative">
	<!-- Particle Background -->
	<div class="absolute inset-0 pointer-events-none">
		{#each particles as particle}
			<div 
				class="absolute rounded-full bg-gray-400 animate-float"
				style="
					left: {particle.x}%;
					top: {particle.y}%;
					width: {particle.size}px;
					height: {particle.size}px;
					opacity: {particle.opacity};
					animation-delay: {Math.random() * 5}s;
					animation-duration: {10 + Math.random() * 10}s;
				"
			></div>
		{/each}
	</div>

	<!-- Asymmetrical Grid Background -->
	<div class="absolute inset-0 pointer-events-none opacity-5">
		<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
					<path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" stroke-width="0.5"/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)" />
		</svg>
	</div>

	<!-- Hero Section -->
	<section class="relative min-h-screen flex items-center justify-center">
		<div class="container mx-auto px-6 relative z-10">
			<!-- Main Hero Text with Transformation -->
			<button 
				class="text-8xl md:text-9xl font-mono font-bold text-center mb-8 cursor-pointer select-none transition-all duration-300 hover:scale-105 bg-transparent border-none p-0 w-full"
				style="
					letter-spacing: 0.2em;
					text-shadow: 
						2px 2px 0 rgba(0,0,0,0.1),
						4px 4px 0 rgba(0,0,0,0.05),
						6px 6px 12px rgba(0,0,0,0.1);
					filter: contrast(1.2);
					opacity: {$morphProgress * 0.3 + 0.7};
				"
				onclick={handleHeroClick}
			>
				{#each heroText.split('') as letter, i}
					<span 
						class="inline-block transition-all duration-700"
						style="
							transform: 
								translateY({Math.sin(i) * $morphProgress * 10}px)
								rotate({(Math.random() - 0.5) * $morphProgress * 10}deg)
								scale({1 - $morphProgress * 0.1 + 0.1});
							opacity: {1 - $morphProgress * 0.2};
						"
					>
						{letter}
					</span>
				{/each}
			</button>

			<!-- Subtitle -->
			<p class="text-xl md:text-2xl text-center text-gray-600 mb-12 font-light tracking-wide">
				Hyperautomation: Agentic AI Meets RPA
			</p>

			<!-- Abstract Shapes -->
			<div class="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 opacity-10">
				<div class="w-full h-full bg-gray-800 rounded-full blur-3xl transform rotate-45"></div>
			</div>
			<div class="absolute -right-20 top-1/3 w-48 h-48 opacity-10">
				<div class="w-full h-full bg-gray-700 rounded-full blur-2xl"></div>
			</div>
		</div>
	</section>

	<!-- Content Section -->
	<section class="relative py-24 px-6">
		<div class="container mx-auto max-w-6xl">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
				<!-- Card 1 -->
				<div class="relative group transform rotate-1 hover:rotate-0 transition-transform duration-300">
					<div class="bg-white p-8 rounded-lg shadow-lg border border-gray-200 relative overflow-hidden">
						<div class="absolute -top-4 -right-4 w-24 h-24 bg-gray-100 rounded-full opacity-20"></div>
						<h3 class="text-2xl font-bold mb-4 text-gray-800">Agentic AI</h3>
						<p class="text-gray-600 leading-relaxed">
							Self-healing systems that adapt and evolve, bringing consciousness to automation.
						</p>
						<div class="mt-6 flex space-x-2">
							{#each [1, 2, 3] as dot}
								<div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: {dot * 0.2}s"></div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Card 2 -->
				<div class="relative group transform -rotate-2 hover:rotate-0 transition-transform duration-300 md:translate-y-8">
					<div class="bg-gray-900 text-white p-8 rounded-lg shadow-xl relative overflow-hidden">
						<div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-800 rounded-full opacity-30"></div>
						<h3 class="text-2xl font-bold mb-4">Process Symphony</h3>
						<p class="text-gray-300 leading-relaxed">
							Orchestrating complex workflows with the precision of a conductor and the creativity of an artist.
						</p>
						<div class="mt-6 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
							<div class="h-full bg-gray-500 rounded-full animate-slide"></div>
						</div>
					</div>
				</div>

				<!-- Card 3 -->
				<div class="relative group transform rotate-1 hover:rotate-0 transition-transform duration-300">
					<div class="bg-gray-100 p-8 rounded-lg shadow-lg relative overflow-hidden">
						<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gray-200 rounded-full opacity-20 blur-xl"></div>
						<h3 class="text-2xl font-bold mb-4 text-gray-800">Flow State</h3>
						<p class="text-gray-600 leading-relaxed">
							Seamless automation that moves like water, finding the optimal path through complexity with zero friction.
						</p>
						<div class="mt-6 grid grid-cols-3 gap-1">
							{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as square}
								<div 
									class="w-4 h-4 bg-gray-400 rounded-sm opacity-40 animate-pulse"
									style="animation-delay: {square * 0.1}s"
								></div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Philosophy Section -->
	<section class="relative py-24 px-6 bg-gradient-to-b from-transparent to-gray-100">
		<div class="container mx-auto max-w-4xl text-center">
			<h2 class="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
				The Art of Automation
			</h2>
			<p class="text-xl text-gray-600 leading-relaxed mb-12">
				Like impressionist painters who captured fleeting moments of light and movement, 
				we capture the essence of human intelligence in digital form. Each automated process 
				is a brushstroke in the larger canvas of hyperautomation.
			</p>
			
			<!-- Visual Transformation Display -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
				<!-- A93N7 to AgENT Transformation -->
				<div class="bg-gray-900 p-8 rounded-lg shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
					<div class="text-center space-y-6">
						<div class="space-y-1">
							<div class="text-4xl font-mono font-bold text-gray-400 tracking-[0.3em]">
								A93N7
							</div>
							<div class="text-xs text-gray-600 tracking-widest">VISUAL CIPHER</div>
						</div>
						<div class="flex justify-center items-center py-4">
							<svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
							</svg>
						</div>
						<div class="space-y-1">
							<div class="text-4xl font-mono font-bold text-white tracking-[0.3em]">
							AgENT
							</div>
							<div class="text-xs text-gray-400 tracking-widest">DECODED IDENTITY</div>
						</div>
					</div>
				</div>

				<!-- Hyperautomation Formula -->
				<div class="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-lg shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300">
					<div class="text-center space-y-6">
						<h3 class="text-lg font-bold text-gray-700 uppercase tracking-wider">The Formula</h3>
						<div class="flex justify-center items-center space-x-3">
							<div class="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center shadow-inner">
								<span class="text-gray-700 font-bold text-sm">RPA</span>
							</div>
							<div class="text-3xl text-gray-500 font-light">×</div>
							<div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
								<span class="text-white font-bold text-sm">AI</span>
							</div>
						</div>
						<div class="pt-4 space-y-2">
							<div class="text-3xl font-bold text-gray-800">=</div>
							<div class="relative inline-block">
								<div class="text-6xl font-bold text-gray-900 tracking-widest animate-pulse-scale">∞</div>
								<div class="absolute inset-0 text-6xl font-bold text-gray-600 tracking-widest animate-glow opacity-50">∞</div>
							</div>
							<div class="text-xs text-gray-600 uppercase tracking-wider mt-2">Infinite Possibilities</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Call to Action -->
	<section class="relative py-24 px-6">
		<div class="container mx-auto max-w-2xl text-center">
			<div class="transform -rotate-1 hover:rotate-0 transition-transform duration-300">
				<button 
					class="group relative px-12 py-6 bg-gray-900 text-white text-xl font-bold rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
					onclick={() => alert('Welcome to the future of hyperautomation')}
				>
					<span class="relative z-10">Begin the Journey</span>
					<div class="absolute inset-0 bg-gray-700 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform"></div>
					<div class="absolute inset-0 bg-gray-800 rounded-lg transform -rotate-3 group-hover:-rotate-6 transition-transform"></div>
				</button>
			</div>
			
			<p class="mt-8 text-gray-500 text-sm">
				A93N7 • AGENT • The Future is Yours
			</p>
		</div>
	</section>
</main>

<style>
	@keyframes float {
		0%, 100% { transform: translateY(0) translateX(0); }
		25% { transform: translateY(-20px) translateX(10px); }
		50% { transform: translateY(10px) translateX(-5px); }
		75% { transform: translateY(-10px) translateX(-10px); }
	}

	@keyframes slide {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(400%); }
	}

	@keyframes pulse-scale {
		0%, 100% { transform: scale(1); opacity: 1; }
		50% { transform: scale(1.1); opacity: 0.9; }
	}

	@keyframes glow {
		0%, 100% { transform: scale(1) rotate(0deg); filter: blur(0px); }
		50% { transform: scale(1.2) rotate(5deg); filter: blur(3px); }
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.animate-float {
		animation: float linear infinite;
	}

	.animate-slide {
		animation: slide 3s ease-in-out infinite;
	}

	.animate-pulse-scale {
		animation: pulse-scale 2s ease-in-out infinite;
	}

	.animate-glow {
		animation: glow 3s ease-in-out infinite;
	}
</style>