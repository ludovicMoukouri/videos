import Vue from 'vue';
import Register from '@/pages/Register';
describe('Register', () => {
	let cmp, vm;
	beforeEach(() => {
		cmp = Vue.extend(Register);
		vm = new cmp({
			data: {
				valid: true
			}
		}).$mount()
	})
	it('valid data equals null', () => {
		console.log(vm.valid);
		expect(vm.valid).to.eql(true)
	})

	it('has a submit() method', () => {
		assert.deepEqual(typeof vm.signup, 'function')
	})
	it('has a clear() method', () => {
		assert.deepEqual(typeof vm.clear, 'function')
	})

})