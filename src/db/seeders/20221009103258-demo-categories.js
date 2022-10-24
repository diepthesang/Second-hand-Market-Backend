'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */


    await queryInterface.upsert('Categories', [
      {
        cateName: 'Thiết bị điện tử',
        cateParent: null,
      },
      {
        cateName: 'Điện thoại, máy tính bảng',
        cateParent: 1,
      },
      {
        cateName: 'Laptop, máy tính bàn',
        cateParent: 1,
      },
      {
        cateName: 'Tivi, Tủ lạnh, thiết bị âm thanh',
        cateParent: 1,
      },
      {
        cateName: 'Thời trang đồ dùng cá nhân',
        cateParent: null,
      },
      {
        cateName: 'Quần áo',
        cateParent: 1,
      },
      {
        cateName: 'Đồng hồ',
        cateParent: 1,
      },
      {
        cateName: 'Giày dép',
        cateParent: 1,
      },
      {
        cateName: 'Túi xách',
        cateParent: 1,
      },
      {
        cateName: 'Nước hoa',
        cateParent: 1,
      },
      {
        cateName: 'Phụ kiện thời trang khác',
        cateParent: 1,
      },
      {
        cateName: 'Giải trí, thể thao, sở thích',
        cateParent: 1,
      },
      {
        cateName: 'Nhạc cụ',
        cateParent: 1,
      },
      {
        cateName: 'Sách',
        cateParent: 1,
      },
      {
        cateName: 'Đồ thể thao, dã ngoại',
        cateParent: 1,
      },
      {
        cateName: 'Đồ sưu tầm, đồ cổ',
        cateParent: 1,
      },
      {
        cateName: 'Thiết bị chơi game',
        cateParent: 1,
      },
      {
        cateName: 'Sở thích khác',
        cateParent: 1,
      },
      {
        cateName: 'Đồ gia dựng, nội thất, cây cảnh',
        cateParent: 1,
      },
      {
        cateName: 'Bàn ghế',
        cateParent: 1,
      },
      {
        cateName: 'Tủ, kệ gia đình',
        cateParent: 1,
      },
      {
        cateName: 'Giường, chăn ga gối nệm',
        cateParent: 1,
      },
      {
        cateName: 'Bếp, lò, đồ điện nhà bếp',
        cateParent: 1,
      },
      {
        cateName: 'Dụng cụ nhà bếp',
        cateParent: 1,
      },
      {
        cateName: 'Quạt',
        cateParent: 1,
      },
      {
        cateName: 'Đèn',
        cateParent: 1,
      },
      {
        cateName: 'Cây cảnh',
        cateParent: 1,
      },
      {
        cateName: 'Đồ trang trí',
        cateParent: 1,
      },
      {
        cateName: 'Thiết bị vệ sinh, nhà tắm',
        cateParent: 1,
      },
      {
        cateName: 'Nội thất, đồ gia dụng khác',
        cateParent: 1,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
