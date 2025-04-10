/*
 Navicat Premium Data Transfer

 Source Server         : NICOY
 Source Server Type    : MySQL
 Source Server Version : 80041
 Source Host           : 124.222.150.175:13316
 Source Schema         : identity_mini_app

 Target Server Type    : MySQL
 Target Server Version : 80041
 File Encoding         : 65001

 Date: 04/04/2025 16:47:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_count
-- ----------------------------
DROP TABLE IF EXISTS `user_count`;
CREATE TABLE `user_count`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '微信小程序openid',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
