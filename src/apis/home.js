import http from "@/utils/http.js";

// 获取轮番图

export function getBannerAPI(distributionSite='1') {
    return http.get('/home/banner',{params:{distributionSite}})
}

// 获取新鲜好物

export function getNewAPI() {
    return http.get('/home/new')
}

// 获取人气推荐

export function getHotAPI() {
    return http.get('/home/hot')
}

// 获取产品列表

export function getGoodsAPI() {
    return http.get('/home/goods')
}