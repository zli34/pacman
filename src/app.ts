import { Wall } from "./backend/wall";
import { Dot } from "./backend/dot";
import { PePacmanGame } from "./frontend/viewer";

window.onload = () => {
    var walls = new Array<Wall>();

    // walls are generated using gen_walls.el
    walls.push(new Wall([448, 449, 450, 451, 452, 453,
        425, 397, 369, 341,
        340, 339, 338, 337, 336,
        308, 280, 252, 224, 196, 168, 140, 112, 84,
        85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97,
        125, 153, 181, 209,
        210,
        182, 154, 126, 98,
        99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
        139, 167, 195, 223, 251, 279, 307, 335, 363,
        362, 361, 360, 359, 358,
        386, 414, 442, 470,
        471, 472, 473, 474, 475
    ], false));

    // 0, 18
    walls.push(new Wall([
        504, 505, 506, 507, 508, 509, 537, 565, 593, 621, 620, 619, 618, 617,
        616, 644, 672, 700, 728, 756, 757, 758, 786, 785, 784, 812, 840, 868,
        896, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936,
        937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950,
        951, 923, 895, 867, 839, 811, 810, 809, 781, 782, 783, 755, 727, 699,
        671, 643, 642, 641, 640, 639, 638, 610, 582, 554, 526, 527, 528, 529,
        530, 531
    ], false));


    walls.push(new Wall([
        142, 143, 144, 145,
        173, 201,
        200, 199, 198
    ], true));

    walls.push(new Wall([
        147, 148, 149, 150, 151,
        179, 207,
        206, 205, 204, 203,
        175
    ], true));

    walls.push(new Wall([
        156, 157, 158, 159, 160, 188, 216, 215, 214, 213, 212, 184
    ], true));

    // 22, 5
    walls.push(new Wall([
        162, 163, 164, 165, 193, 221, 220, 219, 218, 190
    ], true));

    walls.push(new Wall([
        254, 255, 256, 257, 285, 284, 283, 282
    ], true));

    walls.push(new Wall([
        259, 260, 288, 316, 344, 345, 346, 347, 375, 374, 373, 372, 400,
        428, 456, 455, 427, 399, 371, 343, 315, 287
    ], true));

    walls.push(new Wall([
        262, 263, 264, 265, 266, 267, 268, 269, 297, 296, 295, 294, 322,
        350, 378, 377, 349, 321, 293, 292, 291, 290
    ], true));

    // 19, 9
    walls.push(new Wall([
        271, 272, 300, 328, 356, 384, 412, 440, 468, 467, 439, 411, 383,
        382, 381, 380, 352, 353, 354, 355, 327, 299
    ], true));

    // 22, 9
    walls.push(new Wall([
        274, 275, 276, 277, 305, 304, 303, 302
    ], true));

    // 7, 18
    walls.push(new Wall([
        511, 512, 540, 568, 596, 624, 623, 595, 567, 539
    ], true));

    // 10, 21
    walls.push(new Wall([
        598, 599, 600, 601, 602, 603, 604, 605, 633, 632, 631, 630, 658,
        686, 714, 713, 685, 657, 629, 628, 627, 626
    ], true));

    // 19, 18
    walls.push(new Wall([
        523, 524, 552, 580, 608, 636, 635, 607, 579, 551
    ], true));

    // 2, 24
    walls.push(new Wall([
        674, 675, 676, 677, 705, 733, 761, 789, 788, 760, 732, 704, 703, 702
    ], true));

    // 7, 24
    walls.push(new Wall([
        679, 680, 681, 682, 683, 711, 710, 709, 708, 707
    ], true));

    // 16, 24
    walls.push(new Wall([
        688, 689, 690, 691, 692, 720, 719, 718, 717, 716
    ], true));

    // 22, 24
    walls.push(new Wall([
        694, 695, 696, 697, 725, 724, 723, 751, 779, 807, 806, 778, 750, 722
    ], true));

    // 2, 30
    walls.push(new Wall([
        842, 843, 844, 845, 846, 847, 819, 791, 763, 764, 792, 820, 848,
        849, 850, 851, 879, 878, 877, 876, 875, 874, 873, 872, 871, 870
    ], true));

    // 10, 27
    walls.push(new Wall([
        766, 767, 768, 769, 770, 771, 772, 773, 801, 800, 799, 798, 826,
        854, 882, 881, 853, 825, 797, 796, 795, 794
    ], true));

    // 16, 30
    walls.push(new Wall([
        856, 857, 858, 859, 831, 803, 775, 776, 804, 832, 860, 861, 862,
        863, 864, 865, 893, 892, 891, 890, 889, 888, 887, 886, 885, 884
    ], true));

    var dots = new Array<Dot>();

    // dots are generated using gen_tiles.el
    dots.push(new Dot(0, 113, 1, -1, 141, -1, 114));
    dots.push(new Dot(1, 114, 1, -1, -1, 113, 115));
    dots.push(new Dot(2, 115, 1, -1, -1, 114, 116));
    dots.push(new Dot(3, 116, 1, -1, -1, 115, 117));
    dots.push(new Dot(4, 117, 1, -1, -1, 116, 118));
    dots.push(new Dot(5, 118, 1, -1, 146, 117, 119));
    dots.push(new Dot(6, 119, 1, -1, -1, 118, 120));
    dots.push(new Dot(7, 120, 1, -1, -1, 119, 121));
    dots.push(new Dot(8, 121, 1, -1, -1, 120, 122));
    dots.push(new Dot(9, 122, 1, -1, -1, 121, 123));
    dots.push(new Dot(10, 123, 1, -1, -1, 122, 124));
    dots.push(new Dot(11, 124, 1, -1, 152, 123, -1));
    dots.push(new Dot(12, 127, 1, -1, 155, -1, 128));
    dots.push(new Dot(13, 128, 1, -1, -1, 127, 129));
    dots.push(new Dot(14, 129, 1, -1, -1, 128, 130));
    dots.push(new Dot(15, 130, 1, -1, -1, 129, 131));
    dots.push(new Dot(16, 131, 1, -1, -1, 130, 132));
    dots.push(new Dot(17, 132, 1, -1, -1, 131, 133));
    dots.push(new Dot(18, 133, 1, -1, 161, 132, 134));
    dots.push(new Dot(19, 134, 1, -1, -1, 133, 135));
    dots.push(new Dot(20, 135, 1, -1, -1, 134, 136));
    dots.push(new Dot(21, 136, 1, -1, -1, 135, 137));
    dots.push(new Dot(22, 137, 1, -1, -1, 136, 138));
    dots.push(new Dot(23, 138, 1, -1, 166, 137, -1));
    dots.push(new Dot(24, 141, 1, 113, 169, -1, -1));
    dots.push(new Dot(25, 146, 1, 118, 174, -1, -1));
    dots.push(new Dot(26, 152, 1, 124, 180, -1, -1));
    dots.push(new Dot(27, 155, 1, 127, 183, -1, -1));
    dots.push(new Dot(28, 161, 1, 133, 189, -1, -1));
    dots.push(new Dot(29, 166, 1, 138, 194, -1, -1));
    dots.push(new Dot(30, 169, 2, 141, 197, -1, -1));
    dots.push(new Dot(31, 174, 1, 146, 202, -1, -1));
    dots.push(new Dot(32, 180, 1, 152, 208, -1, -1));
    dots.push(new Dot(33, 183, 1, 155, 211, -1, -1));
    dots.push(new Dot(34, 189, 1, 161, 217, -1, -1));
    dots.push(new Dot(35, 194, 2, 166, 222, -1, -1));
    dots.push(new Dot(36, 197, 1, 169, 225, -1, -1));
    dots.push(new Dot(37, 202, 1, 174, 230, -1, -1));
    dots.push(new Dot(38, 208, 1, 180, 236, -1, -1));
    dots.push(new Dot(39, 211, 1, 183, 239, -1, -1));
    dots.push(new Dot(40, 217, 1, 189, 245, -1, -1));
    dots.push(new Dot(41, 222, 1, 194, 250, -1, -1));
    dots.push(new Dot(42, 225, 1, 197, 253, -1, 226));
    dots.push(new Dot(43, 226, 1, -1, -1, 225, 227));
    dots.push(new Dot(44, 227, 1, -1, -1, 226, 228));
    dots.push(new Dot(45, 228, 1, -1, -1, 227, 229));
    dots.push(new Dot(46, 229, 1, -1, -1, 228, 230));
    dots.push(new Dot(47, 230, 1, 202, 258, 229, 231));
    dots.push(new Dot(48, 231, 1, -1, -1, 230, 232));
    dots.push(new Dot(49, 232, 1, -1, -1, 231, 233));
    dots.push(new Dot(50, 233, 1, -1, 261, 232, 234));
    dots.push(new Dot(51, 234, 1, -1, -1, 233, 235));
    dots.push(new Dot(52, 235, 1, -1, -1, 234, 236));
    dots.push(new Dot(53, 236, 1, 208, -1, 235, 237));
    dots.push(new Dot(54, 237, 1, -1, -1, 236, 238));
    dots.push(new Dot(55, 238, 1, -1, -1, 237, 239));
    dots.push(new Dot(56, 239, 1, 211, -1, 238, 240));
    dots.push(new Dot(57, 240, 1, -1, -1, 239, 241));
    dots.push(new Dot(58, 241, 1, -1, -1, 240, 242));
    dots.push(new Dot(59, 242, 1, -1, 270, 241, 243));
    dots.push(new Dot(60, 243, 1, -1, -1, 242, 244));
    dots.push(new Dot(61, 244, 1, -1, -1, 243, 245));
    dots.push(new Dot(62, 245, 1, 217, 273, 244, 246));
    dots.push(new Dot(63, 246, 1, -1, -1, 245, 247));
    dots.push(new Dot(64, 247, 1, -1, -1, 246, 248));
    dots.push(new Dot(65, 248, 1, -1, -1, 247, 249));
    dots.push(new Dot(66, 249, 1, -1, -1, 248, 250));
    dots.push(new Dot(67, 250, 1, 222, 278, 249, -1));
    dots.push(new Dot(68, 253, 1, 225, 281, -1, -1));
    dots.push(new Dot(69, 258, 1, 230, 286, -1, -1));
    dots.push(new Dot(70, 261, 1, 233, 289, -1, -1));
    dots.push(new Dot(71, 270, 1, 242, 298, -1, -1));
    dots.push(new Dot(72, 273, 1, 245, 301, -1, -1));
    dots.push(new Dot(73, 278, 1, 250, 306, -1, -1));
    dots.push(new Dot(74, 281, 1, 253, 309, -1, -1));
    dots.push(new Dot(75, 286, 1, 258, 314, -1, -1));
    dots.push(new Dot(76, 289, 1, 261, 317, -1, -1));
    dots.push(new Dot(77, 298, 1, 270, 326, -1, -1));
    dots.push(new Dot(78, 301, 1, 273, 329, -1, -1));
    dots.push(new Dot(79, 306, 1, 278, 334, -1, -1));
    dots.push(new Dot(80, 309, 1, 281, -1, -1, 310));
    dots.push(new Dot(81, 310, 1, -1, -1, 309, 311));
    dots.push(new Dot(82, 311, 1, -1, -1, 310, 312));
    dots.push(new Dot(83, 312, 1, -1, -1, 311, 313));
    dots.push(new Dot(84, 313, 1, -1, -1, 312, 314));
    dots.push(new Dot(85, 314, 1, 286, 342, 313, -1));
    dots.push(new Dot(86, 317, 1, 289, -1, -1, 318));
    dots.push(new Dot(87, 318, 1, -1, -1, 317, 319));
    dots.push(new Dot(88, 319, 1, -1, -1, 318, 320));
    dots.push(new Dot(89, 320, 1, -1, 348, 319, -1));
    dots.push(new Dot(90, 323, 1, -1, 351, -1, 324));
    dots.push(new Dot(91, 324, 1, -1, -1, 323, 325));
    dots.push(new Dot(92, 325, 1, -1, -1, 324, 326));
    dots.push(new Dot(93, 326, 1, 298, -1, 325, -1));
    dots.push(new Dot(94, 329, 1, 301, 357, -1, 330));
    dots.push(new Dot(95, 330, 1, -1, -1, 329, 331));
    dots.push(new Dot(96, 331, 1, -1, -1, 330, 332));
    dots.push(new Dot(97, 332, 1, -1, -1, 331, 333));
    dots.push(new Dot(98, 333, 1, -1, -1, 332, 334));
    dots.push(new Dot(99, 334, 1, 306, -1, 333, -1));
    dots.push(new Dot(100, 342, 1, 314, 370, -1, -1));
    dots.push(new Dot(101, 348, 0, 320, 376, -1, -1));
    dots.push(new Dot(102, 351, 0, 323, 379, -1, -1));
    dots.push(new Dot(103, 357, 1, 329, 385, -1, -1));
    dots.push(new Dot(104, 370, 1, 342, 398, -1, -1));
    dots.push(new Dot(105, 376, 0, 348, 404, -1, -1));
    dots.push(new Dot(106, 379, 0, 351, 407, -1, -1));
    dots.push(new Dot(107, 385, 1, 357, 413, -1, -1));
    dots.push(new Dot(108, 398, 1, 370, 426, -1, -1));
    dots.push(new Dot(109, 401, 0, -1, 429, -1, 402));
    dots.push(new Dot(110, 402, 0, -1, -1, 401, 403));
    dots.push(new Dot(111, 403, 0, -1, -1, 402, 404));
    dots.push(new Dot(112, 404, 0, 376, -1, 403, 405));
    dots.push(new Dot(113, 405, 0, -1, -1, 404, 406));
    dots.push(new Dot(114, 406, 0, -1, -1, 405, 407));
    dots.push(new Dot(115, 407, 0, 379, -1, 406, 408));
    dots.push(new Dot(116, 408, 0, -1, -1, 407, 409));
    dots.push(new Dot(117, 409, 0, -1, -1, 408, 410));
    dots.push(new Dot(118, 410, 0, -1, 438, 409, -1));
    dots.push(new Dot(119, 413, 1, 385, 441, -1, -1));
    dots.push(new Dot(120, 426, 1, 398, 454, -1, -1));
    dots.push(new Dot(121, 429, 0, 401, 457, -1, -1));
    dots.push(new Dot(122, 438, 0, 410, 466, -1, -1));
    dots.push(new Dot(123, 441, 1, 413, 469, -1, -1));
    dots.push(new Dot(124, 454, 1, 426, 482, -1, -1));
    dots.push(new Dot(125, 457, 0, 429, 485, -1, -1));
    dots.push(new Dot(126, 466, 0, 438, 494, -1, -1));
    dots.push(new Dot(127, 469, 1, 441, 497, -1, -1));
    dots.push(new Dot(128, 476, 0, -1, -1, 503, 477));
    dots.push(new Dot(129, 477, 0, -1, -1, 476, 478));
    dots.push(new Dot(130, 478, 0, -1, -1, 477, 479));
    dots.push(new Dot(131, 479, 0, -1, -1, 478, 480));
    dots.push(new Dot(132, 480, 0, -1, -1, 479, 481));
    dots.push(new Dot(133, 481, 0, -1, -1, 480, 482));
    dots.push(new Dot(134, 482, 1, 454, 510, 481, 483));
    dots.push(new Dot(135, 483, 0, -1, -1, 482, 484));
    dots.push(new Dot(136, 484, 0, -1, -1, 483, 485));
    dots.push(new Dot(137, 485, 0, 457, 513, 484, -1));
    dots.push(new Dot(138, 494, 0, 466, 522, -1, 495));
    dots.push(new Dot(139, 495, 0, -1, -1, 494, 496));
    dots.push(new Dot(140, 496, 0, -1, -1, 495, 497));
    dots.push(new Dot(141, 497, 1, 469, 525, 496, 498));
    dots.push(new Dot(142, 498, 0, -1, -1, 497, 499));
    dots.push(new Dot(143, 499, 0, -1, -1, 498, 500));
    dots.push(new Dot(144, 500, 0, -1, -1, 499, 501));
    dots.push(new Dot(145, 501, 0, -1, -1, 500, 502));
    dots.push(new Dot(146, 502, 0, -1, -1, 501, 503));
    dots.push(new Dot(147, 503, 0, -1, -1, 502, 476));
    dots.push(new Dot(148, 510, 1, 482, 538, -1, -1));
    dots.push(new Dot(149, 513, 0, 485, 541, -1, -1));
    dots.push(new Dot(150, 522, 0, 494, 550, -1, -1));
    dots.push(new Dot(151, 525, 1, 497, 553, -1, -1));
    dots.push(new Dot(152, 538, 1, 510, 566, -1, -1));
    dots.push(new Dot(153, 541, 0, 513, 569, -1, -1));
    dots.push(new Dot(154, 550, 0, 522, 578, -1, -1));
    dots.push(new Dot(155, 553, 1, 525, 581, -1, -1));
    dots.push(new Dot(156, 566, 1, 538, 594, -1, -1));
    dots.push(new Dot(157, 569, 0, 541, 597, -1, 570));
    dots.push(new Dot(158, 570, 0, -1, -1, 569, 571));
    dots.push(new Dot(159, 571, 0, -1, -1, 570, 572));
    dots.push(new Dot(160, 572, 0, -1, -1, 571, 573));
    dots.push(new Dot(161, 573, 0, -1, -1, 572, 574));
    dots.push(new Dot(162, 574, 0, -1, -1, 573, 575));
    dots.push(new Dot(163, 575, 0, -1, -1, 574, 576));
    dots.push(new Dot(164, 576, 0, -1, -1, 575, 577));
    dots.push(new Dot(165, 577, 0, -1, -1, 576, 578));
    dots.push(new Dot(166, 578, 0, 550, 606, 577, -1));
    dots.push(new Dot(167, 581, 1, 553, 609, -1, -1));
    dots.push(new Dot(168, 594, 1, 566, 622, -1, -1));
    dots.push(new Dot(169, 597, 0, 569, 625, -1, -1));
    dots.push(new Dot(170, 606, 0, 578, 634, -1, -1));
    dots.push(new Dot(171, 609, 1, 581, 637, -1, -1));
    dots.push(new Dot(172, 622, 1, 594, 650, -1, -1));
    dots.push(new Dot(173, 625, 0, 597, 653, -1, -1));
    dots.push(new Dot(174, 634, 0, 606, 662, -1, -1));
    dots.push(new Dot(175, 637, 1, 609, 665, -1, -1));
    dots.push(new Dot(176, 645, 1, -1, 673, -1, 646));
    dots.push(new Dot(177, 646, 1, -1, -1, 645, 647));
    dots.push(new Dot(178, 647, 1, -1, -1, 646, 648));
    dots.push(new Dot(179, 648, 1, -1, -1, 647, 649));
    dots.push(new Dot(180, 649, 1, -1, -1, 648, 650));
    dots.push(new Dot(181, 650, 1, 622, 678, 649, 651));
    dots.push(new Dot(182, 651, 1, -1, -1, 650, 652));
    dots.push(new Dot(183, 652, 1, -1, -1, 651, 653));
    dots.push(new Dot(184, 653, 1, 625, -1, 652, 654));
    dots.push(new Dot(185, 654, 1, -1, -1, 653, 655));
    dots.push(new Dot(186, 655, 1, -1, -1, 654, 656));
    dots.push(new Dot(187, 656, 1, -1, 684, 655, -1));
    dots.push(new Dot(188, 659, 1, -1, 687, -1, 660));
    dots.push(new Dot(189, 660, 1, -1, -1, 659, 661));
    dots.push(new Dot(190, 661, 1, -1, -1, 660, 662));
    dots.push(new Dot(191, 662, 1, 634, -1, 661, 663));
    dots.push(new Dot(192, 663, 1, -1, -1, 662, 664));
    dots.push(new Dot(193, 664, 1, -1, -1, 663, 665));
    dots.push(new Dot(194, 665, 1, 637, 693, 664, 666));
    dots.push(new Dot(195, 666, 1, -1, -1, 665, 667));
    dots.push(new Dot(196, 667, 1, -1, -1, 666, 668));
    dots.push(new Dot(197, 668, 1, -1, -1, 667, 669));
    dots.push(new Dot(198, 669, 1, -1, -1, 668, 670));
    dots.push(new Dot(199, 670, 1, -1, 698, 669, -1));
    dots.push(new Dot(200, 673, 1, 645, 701, -1, -1));
    dots.push(new Dot(201, 678, 1, 650, 706, -1, -1));
    dots.push(new Dot(202, 684, 1, 656, 712, -1, -1));
    dots.push(new Dot(203, 687, 1, 659, 715, -1, -1));
    dots.push(new Dot(204, 693, 1, 665, 721, -1, -1));
    dots.push(new Dot(205, 698, 1, 670, 726, -1, -1));
    dots.push(new Dot(206, 701, 1, 673, 729, -1, -1));
    dots.push(new Dot(207, 706, 1, 678, 734, -1, -1));
    dots.push(new Dot(208, 712, 1, 684, 740, -1, -1));
    dots.push(new Dot(209, 715, 1, 687, 743, -1, -1));
    dots.push(new Dot(210, 721, 1, 693, 749, -1, -1));
    dots.push(new Dot(211, 726, 1, 698, 754, -1, -1));
    dots.push(new Dot(212, 729, 2, 701, -1, -1, 730));
    dots.push(new Dot(213, 730, 1, -1, -1, 729, 731));
    dots.push(new Dot(214, 731, 1, -1, 759, 730, -1));
    dots.push(new Dot(215, 734, 1, 706, 762, -1, 735));
    dots.push(new Dot(216, 735, 1, -1, -1, 734, 736));
    dots.push(new Dot(217, 736, 1, -1, -1, 735, 737));
    dots.push(new Dot(218, 737, 1, -1, 765, 736, 738));
    dots.push(new Dot(219, 738, 1, -1, -1, 737, 739));
    dots.push(new Dot(220, 739, 1, -1, -1, 738, 740));
    dots.push(new Dot(221, 740, 1, 712, -1, 739, 741));
    dots.push(new Dot(222, 741, 0, -1, -1, 740, 742));
    dots.push(new Dot(223, 742, 0, -1, -1, 741, 743));
    dots.push(new Dot(224, 743, 1, 715, -1, 742, 744));
    dots.push(new Dot(225, 744, 1, -1, -1, 743, 745));
    dots.push(new Dot(226, 745, 1, -1, -1, 744, 746));
    dots.push(new Dot(227, 746, 1, -1, 774, 745, 747));
    dots.push(new Dot(228, 747, 1, -1, -1, 746, 748));
    dots.push(new Dot(229, 748, 1, -1, -1, 747, 749));
    dots.push(new Dot(230, 749, 1, 721, 777, 748, -1));
    dots.push(new Dot(231, 752, 1, -1, 780, -1, 753));
    dots.push(new Dot(232, 753, 1, -1, -1, 752, 754));
    dots.push(new Dot(233, 754, 2, 726, -1, 753, -1));
    dots.push(new Dot(234, 759, 1, 731, 787, -1, -1));
    dots.push(new Dot(235, 762, 1, 734, 790, -1, -1));
    dots.push(new Dot(236, 765, 1, 737, 793, -1, -1));
    dots.push(new Dot(237, 774, 1, 746, 802, -1, -1));
    dots.push(new Dot(238, 777, 1, 749, 805, -1, -1));
    dots.push(new Dot(239, 780, 1, 752, 808, -1, -1));
    dots.push(new Dot(240, 787, 1, 759, 815, -1, -1));
    dots.push(new Dot(241, 790, 1, 762, 818, -1, -1));
    dots.push(new Dot(242, 793, 1, 765, 821, -1, -1));
    dots.push(new Dot(243, 802, 1, 774, 830, -1, -1));
    dots.push(new Dot(244, 805, 1, 777, 833, -1, -1));
    dots.push(new Dot(245, 808, 1, 780, 836, -1, -1));
    dots.push(new Dot(246, 813, 1, -1, 841, -1, 814));
    dots.push(new Dot(247, 814, 1, -1, -1, 813, 815));
    dots.push(new Dot(248, 815, 1, 787, -1, 814, 816));
    dots.push(new Dot(249, 816, 1, -1, -1, 815, 817));
    dots.push(new Dot(250, 817, 1, -1, -1, 816, 818));
    dots.push(new Dot(251, 818, 1, 790, -1, 817, -1));
    dots.push(new Dot(252, 821, 1, 793, -1, -1, 822));
    dots.push(new Dot(253, 822, 1, -1, -1, 821, 823));
    dots.push(new Dot(254, 823, 1, -1, -1, 822, 824));
    dots.push(new Dot(255, 824, 1, -1, 852, 823, -1));
    dots.push(new Dot(256, 827, 1, -1, 855, -1, 828));
    dots.push(new Dot(257, 828, 1, -1, -1, 827, 829));
    dots.push(new Dot(258, 829, 1, -1, -1, 828, 830));
    dots.push(new Dot(259, 830, 1, 802, -1, 829, -1));
    dots.push(new Dot(260, 833, 1, 805, -1, -1, 834));
    dots.push(new Dot(261, 834, 1, -1, -1, 833, 835));
    dots.push(new Dot(262, 835, 1, -1, -1, 834, 836));
    dots.push(new Dot(263, 836, 1, 808, -1, 835, 837));
    dots.push(new Dot(264, 837, 1, -1, -1, 836, 838));
    dots.push(new Dot(265, 838, 1, -1, 866, 837, -1));
    dots.push(new Dot(266, 841, 1, 813, 869, -1, -1));
    dots.push(new Dot(267, 852, 1, 824, 880, -1, -1));
    dots.push(new Dot(268, 855, 1, 827, 883, -1, -1));
    dots.push(new Dot(269, 866, 1, 838, 894, -1, -1));
    dots.push(new Dot(270, 869, 1, 841, 897, -1, -1));
    dots.push(new Dot(271, 880, 1, 852, 908, -1, -1));
    dots.push(new Dot(272, 883, 1, 855, 911, -1, -1));
    dots.push(new Dot(273, 894, 1, 866, 922, -1, -1));
    dots.push(new Dot(274, 897, 1, 869, -1, -1, 898));
    dots.push(new Dot(275, 898, 1, -1, -1, 897, 899));
    dots.push(new Dot(276, 899, 1, -1, -1, 898, 900));
    dots.push(new Dot(277, 900, 1, -1, -1, 899, 901));
    dots.push(new Dot(278, 901, 1, -1, -1, 900, 902));
    dots.push(new Dot(279, 902, 1, -1, -1, 901, 903));
    dots.push(new Dot(280, 903, 1, -1, -1, 902, 904));
    dots.push(new Dot(281, 904, 1, -1, -1, 903, 905));
    dots.push(new Dot(282, 905, 1, -1, -1, 904, 906));
    dots.push(new Dot(283, 906, 1, -1, -1, 905, 907));
    dots.push(new Dot(284, 907, 1, -1, -1, 906, 908));
    dots.push(new Dot(285, 908, 1, 880, -1, 907, 909));
    dots.push(new Dot(286, 909, 1, -1, -1, 908, 910));
    dots.push(new Dot(287, 910, 1, -1, -1, 909, 911));
    dots.push(new Dot(288, 911, 1, 883, -1, 910, 912));
    dots.push(new Dot(289, 912, 1, -1, -1, 911, 913));
    dots.push(new Dot(290, 913, 1, -1, -1, 912, 914));
    dots.push(new Dot(291, 914, 1, -1, -1, 913, 915));
    dots.push(new Dot(292, 915, 1, -1, -1, 914, 916));
    dots.push(new Dot(293, 916, 1, -1, -1, 915, 917));
    dots.push(new Dot(294, 917, 1, -1, -1, 916, 918));
    dots.push(new Dot(295, 918, 1, -1, -1, 917, 919));
    dots.push(new Dot(296, 919, 1, -1, -1, 918, 920));
    dots.push(new Dot(297, 920, 1, -1, -1, 919, 921));
    dots.push(new Dot(298, 921, 1, -1, -1, 920, 922));
    dots.push(new Dot(299, 922, 1, 894, -1, 921, -1));

    var game = new PePacmanGame(28, 36, 16, walls, dots);
};
