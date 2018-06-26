<template>
	<transition name="slide">
		<div class="my-upper"></div>
	</transition >
</template>

<script>
</script>

<style scoped>
	.my-upper{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background: #f5f5f5;
		z-index: 2;
	}
</style>