<script lang="ts">
	import { simulate } from '../simulate';

	const firstAddend = [0, 0, 0, 0, 0, 0, 0, 0];
	const secondAddend = [0, 0, 0, 0, 0, 0, 0, 0];
	let result = [0, 0, 0, 0, 0, 0, 0, 0];
	let carryBit = 0;

	$: {
		const simulatedResult = simulate([...firstAddend].reverse(), [...secondAddend].reverse()).reverse();
		result = simulatedResult.slice(1).map((v) => +v);
		carryBit = +simulatedResult[0];
	}

	const bitsToNum = (bits: number[]) => parseInt(bits.join(''), 2);
</script>

<svelte:head>
	<title>Bit Adder</title>
</svelte:head>

<div class="flex">
	<div class="rounded-full p-4 border-2 m-2 opacity-0 cursor-default">
		+
	</div>
	{#each firstAddend as bit, i}
		<button
			class="rounded-full p-4 border-2 m-2"
			on:click={() => (firstAddend[i] = +!firstAddend[i])}
		>
			{bit}
		</button>
	{/each}
	<div class="rounded-full p-4 border-2 m-2">
		{bitsToNum(firstAddend)}
	</div>
</div>
<div class="flex">
	<div class="rounded-full p-4 border-2 m-2">
		+
	</div>
	{#each secondAddend as bit, i}
		<button
			class="rounded-full p-4 border-2 m-2"
			on:click={() => (secondAddend[i] = +!secondAddend[i])}
		>
			{bit}
		</button>
	{/each}
	<div class="rounded-full p-4 border-2 m-2">
		{bitsToNum(secondAddend)}
	</div>
</div>
<div class="flex">
	<div class="rounded-full p-4 border-2 m-2">
		=
	</div>
	{#each result as bit}
		<div class="rounded-full p-4 border-2 m-2">
			{bit}
		</div>
	{/each}
	<div class="rounded-full p-4 border-2 m-2">
		{bitsToNum(result)}
	</div>
	{#if carryBit}
		<div class="rounded-full p-4 border-2 m-2 ml-5">
			Overflow
		</div>
	{/if}
</div>
