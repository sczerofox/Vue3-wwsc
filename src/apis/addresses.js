import http from "@/utils/http";

/**
 * @description: 获取最新的购物车列表
 * @param {*}
 * @return {*}
 */
export function delAddressAPI(id){
    return http.delete(`/member/address/${id}`);
}

// 添加收货地址
export function addAddressAPI(data){
    return http.post('/member/address',data);
}

//修改收货地址
export function updateAddressAPI(id,data){
    return http.put(`/member/address/${id}`,data);
}