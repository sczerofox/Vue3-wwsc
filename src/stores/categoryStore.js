
import {getCategoryAPI} from "@/apis/layout";

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref([]);
  const getCategory = async () => {
    const res = await getCategoryAPI();
    categoryList.value = res.result;
  }
  onMounted(()=>getCategory() );

  return { categoryList, getCategory }
})
