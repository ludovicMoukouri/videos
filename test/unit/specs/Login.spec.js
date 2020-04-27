import Vue from 'vue';
import Login from '@/pages/Login';
describe('Login', () => {
	let cmp, vm;
	beforeEach(() => {
		cmp = Vue.extend(Login);
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
		assert.deepEqual(typeof vm.login, 'function')
	})
	it('has a clear() method', () => {
		assert.deepEqual(typeof vm.clear, 'function')
	})

})