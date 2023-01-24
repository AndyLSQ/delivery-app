import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', function () {
	const favList = ref([]);

	function alreadyIncluded(searchId) {
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

	console.log('test aI', alreadyIncluded('abc123'));

	function toggleFavorite(favorite) {
		// console.log('favorite came thru as: ', favorite);
		if (alreadyIncluded(favorite)) {
			console.log('already a favorite so remove it');
			removeFavorite(favorite);
		} else {
			console.log('not yet a favorite so add it');
			addFavorite(favorite);
		}
		// console.log('new favlist: ', favList);
	}

	return {
		favList: favList,
		toggleFavorite: toggleFavorite,
		alreadyIncluded: alreadyIncluded,
	};
});
