import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import InteractiveFlowchart from './InteractiveFlowchart.svelte';

// Mock onMount to prevent setInterval from running during tests
vi.mock('svelte', async (importOriginal) => {
	const originalSvelte = await importOriginal();
	return {
		...originalSvelte,
		onMount: (fn) => {
			// Call the onMount function once to set initial state if necessary,
			// but don't set up the interval.
			// For this component, the interval drives state changes we don't want in basic tests.
			// If there was critical setup logic in onMount unrelated to intervals,
			// we might need a more sophisticated mock or to call fn() here.
			// console.log('onMount mocked for InteractiveFlowchart');
		},
	};
});

describe('InteractiveFlowchart.svelte', () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	it('renders the main flowchart container', () => {
		render(InteractiveFlowchart);
		// Check for the role="figure" and the accessible name
		const figure = screen.getByRole('figure', { name: /Interactive Process Flowchart/i });
		expect(figure).toBeInTheDocument();
		expect(figure).toHaveClass('interactive-flowchart-container');
	});

	it('renders initial node titles correctly', () => {
		render(InteractiveFlowchart);
		expect(screen.getByText('Data Ingestion')).toBeInTheDocument();
		expect(screen.getByText('Intelligent Triage & Classification')).toBeInTheDocument();
		expect(screen.getByText('Automated Data Entry')).toBeInTheDocument();
		expect(screen.getByText('Information Enrichment')).toBeInTheDocument();
		expect(screen.getByText('Validation & Quality Check')).toBeInTheDocument();
		expect(screen.getByText('Process Completion & Reporting')).toBeInTheDocument();
		expect(screen.getByText('Optimized Outcome')).toBeInTheDocument();
	});

	it('renders icon containers for each node', () => {
		render(InteractiveFlowchart);
		// The nodes array in the component has 7 nodes.
		// Each node has an icon-container div.
		// We are also checking for aria-hidden="true" which was added.
		const iconContainers = screen.getAllByRole('generic', { hidden: true });
		// SVGs often don't have implicit roles, their containers might be generic.
		// A more robust way would be to add a test-id or a specific class to icon containers for testing.
		// For now, let's filter by a class they all share.

		const actualIconContainers = Array.from(document.querySelectorAll('.icon-container'));
		expect(actualIconContainers.length).toBe(7);

		actualIconContainers.forEach(container => {
			expect(container).toHaveClass('icon-container');
			expect(container.querySelector('svg')).toBeInTheDocument(); // Check if an SVG is rendered within
			expect(container).toHaveAttribute('aria-hidden', 'true');
		});
	});

	it('should have a screen-reader only title', () => {
		render(InteractiveFlowchart);
		const srTitle = screen.getByText('Interactive Process Flowchart');
		// We expect this title to be associated with the figure role if using aria-labelledby
		// and to exist, though it might be visually hidden.
		// Testing for sr-only class would require classList inspection & a defined style.
		expect(srTitle).toBeInTheDocument();
		// Check if it's an h2, though this might be too specific if tag changes
		expect(srTitle.tagName).toBe('H2');
	});
});
