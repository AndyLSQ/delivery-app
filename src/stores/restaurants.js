import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
// import { collection, doc, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
// import { useFirestore, useCollection } from 'vuefire';
import { useFavoritesStore } from '@/stores/favorites';
import SvgIcons from '@/components/icons/IconTemplate.vue';

import restaurantData from '../data/restaurantData.json' assert { type: 'json' };

// ==== FB SETUP ====
// const db = useFirestore();

// Set FB collection of restaurants as reactive data
// const restaurants = useCollection(collection(db, 'restaurants'));

export const useRestaurantStore = defineStore('restaurants', function () {
	const list = ref(restaurantData);

	function add(restaurant) {
		list.push(restaurant);
	}

	return {
		list: list,
		add: add,
	};
});
