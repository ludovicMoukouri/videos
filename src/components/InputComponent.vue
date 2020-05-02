<template>
	<div style="margin:1% 0 1% 0">
		<v-text-field
		outlined
		dense
		:label="label"
		v-model="vmodel"
		:rules="rules"
		required
		>
	</v-text-field>
</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			required: true
		},
		vmodel: {
			type: String,
			required: true
		},
		rules: {
			type: String,
			required: false
		},
	},
};	
</script>
