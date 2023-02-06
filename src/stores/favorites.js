import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', function () {
	const favList = ref([]);

	function alreadyFavorite(searchId) {
		return favList.value.find(function (itemId) {
			return searchId == itemId;
		});
	}

	function addFavorite(favoriteId) {
		favList.value.push(favoriteId);
	}

	function removeFavorite(excludeId) {
		favList.value = favList.value.filter(function (itemId) {
			return excludeId != itemId;
		});
	}

	function toggleFavorite(favorite) {
		if (alreadyFavorite(favorite)) {
			// console.log('already a favorite so remove it');
			removeFavorite(favorite);
		} else {
			// console.log('not yet a favorite so add it');
			addFavorite(favorite);
		}
		// console.log('new favlist: ', favList);
	}

	return {
		favList: favList,
		toggleFavorite: toggleFavorite,
		alreadyFavorite: alreadyFavorite,
	};
});
