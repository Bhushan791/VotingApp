import axiosInstance from './axios';

export const bannersAPI = {
  getBanners: async () => {
    const response = await axiosInstance.get('banners/'); // removed leading slash
    return response.data;
  },

  createBanner: async (bannerData) => {
    const response = await axiosInstance.post('banners/create/', bannerData, {
      headers: {
        'Content-Type': 'multipart/form-data', // for file uploads
      },
    });
    return response.data;
  },
};
