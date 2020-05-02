<template>
	<div style="margin:1% 0 1% 0">
		<v-text-field
		outlined
		dense
		:type="typeprops"
		:label="label"
		:v-model="vmodel"
		:rules="rulespros"
		required
		>
	</v-text-field>
</div>
</template>

<script>
export default {
	data: () => ({
    fullnameRules: [
    v => !!v || 'Name is required',
    v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    emailRules: [
    v => !!v || 'E-mail is required',
    v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid',
    ],
  }),
	props: {
		label: {
			type: String,
			required: true
		},
		vmodel: {
			type: String,
			required: true
		},
		rulespros: {
			type: String,
			required: false
		},
		typeprops: {
			type: String,
			required: false
		},
	},
};	
</script>
