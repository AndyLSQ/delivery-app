import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useInterfaceStore = defineStore('interface', function () {
	const mainMenuOpen = ref(false);

	function toggleMenu() {
		// console.log(mainMenuOpen);
		mainMenuOpen.value = !mainMenuOpen.value;
	}

	const menuClass = computed(function () {
		if (mainMenuOpen.value) {
			return 'menu-open';
		} else {
			return 'menu-closed';
		}
	});
	return { mainMenuOpen, toggleMenu, menuClass };
});
