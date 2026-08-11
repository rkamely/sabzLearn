const simCardModel = require("../../models/sim-card");
const mongoose = require("mongoose");
const validateSimCardBody = require("../../validators/sim-card");
const bcrypt = require("bcrypt");

exports.getSimCards = async (req, res) => {
  try {
    const {
      skip = 0,
      take = 10,
      simcardType,
      typeUsing,
      minPrice,
      maxPrice,
      number,
      sort,
    } = req.body;

    const query = {};
    const sortQuery = {};

    switch (Number(sort)) {
      case 1:
        sortQuery.price = 1;
        break;
      case 2:
        sortQuery.price = -1;
        break;
      default:
        sortQuery.createdAt = -1;
    }

    if ((simcardType == 0) | (simcardType == 1)) query.type = simcardType;
    if ((typeUsing == 0) | (typeUsing == 1) | (typeUsing == 2))
      query.typeUsing = typeUsing;
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (number?.length) {
      if (number.length === 7) {
        // Search in the last 7 digits
        query.number = {
          $regex: `^\\d{4}${number.replaceAll("_", "\\d")}$`,
        };
        console.log(`^\\d{4}${number}$`);
      } else {
        // Full 11-digit pattern with _ wildcards
        const regex = "^" + number.replaceAll("_", "\\d") + "$";
        query.number = {
          $regex: regex,
        };
      }
    }

    const [simCards, total] = await Promise.all([
      simCardModel
        .find(query)
        .sort(sortQuery)
        .select("-__v -updatedAt -createdAt")
        .skip(Number(skip))
        .limit(Number(take)),
      simCardModel.countDocuments(query),
    ]);

    return res.status(200).json({
      status: 200,
      result: {
        data: simCards,
        total,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.registerSimCard = async (req, res) => {
  try {
    const validateBody = validateSimCardBody(req.body);
    if (validateBody !== true) {
      return res.status(422).json({
        errors: validateBody,
      });
    }
    const existSimCard = await simCardModel
      .findOne({ number: req.body.number })
      .lean();

    if (existSimCard) {
      return res.status(404).json({
        message: "Simcard Already Existed",
      });
    }

    const newSimCard = simCardModel.create({
      ...req.body,
      payType: req.body.price > 1000000 ? 1 : 2,
    });

    return res.status(200).json({ status: 200, result: newSimCard });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getInstallmentsTerm = async (req, res) => {
  try {
    const { id } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid simcard id",
      });
    }
    const targetSimCard = await simCardModel.findById(id);

    if (!targetSimCard) {
      return res.status(404).json({
        message: "Simcard not found",
      });
    }

    const cashPayment = {
      price: targetSimCard.price,
      months: null,
      prePayPercents: [100],
      payType: 4,
      textTerms:
        targetSimCard.price < 5000000
          ? "فقط با پرداخت نقدی می توانید سیمکارت های با قیمت کمتر از 5 میلیون تومان را تهیه کنید."
          : "",
    };

    const installmentCondition = {
      creditWalletAmount: 0,
      months: [12],
      ownerType: 0,
      payType: 5,
      payWithCreditUrl: null,
      prePayPercents: [30, 40, 50, 60, 70, 80, 90],
      rules: [
        "بدون نیاز به چک و سفته",
        "اقساط بلند مدت 12 ماهه",
        "سیمکارت بعد از اتمام اقساط به نام شما خواهد شد",
      ],
      title: "اجاره به شرط تملیک (بدون چک و سفته - تحت مالکیت شرکت)",
      totalPrice: 0,
    };

    const creditWaletCondition = {
      creditWalletAmount: 0,
      months: null,
      ownerType: 1,
      payType: 7,
      payWithCreditUrl: "https://loan.setareyek.ir",
      prePayPercents: null,
      rules: [
        "همراه با چک ضمانت",
        "اقساط تا 18 ماه",
        "سیمکارت پلمپ و فعال نشده به خریدار تحویل داده می شود",
      ],
      title:
        "خرید با کیف پول اعتباری ستاره یک (همراه با چک - تحت مالکیت خریدار)",
      totalPrice: 0,
    };

    const ownerTypeDetails = [installmentCondition, creditWaletCondition];

    const installmentPayment = {
      ownerTypeDetails,
      price: targetSimCard.price,
      textTerms: null,
    };

    const referralSourceConfig = {
      ایتا: 15,
      اینستاگرام: 5,
      "بروشور و تراکت کاغذی": 9,
      بله: 13,
      "تبلیغات بنری سایت های اینترنتی": 8,
      "تبلیغات محیطی(بیلبورد و...)": 7,
      تلویزیون: 3,
      تلگرام: 4,
      "جستجو در اینترنت(گوگل و...)": 1,
      "دوستان و آشنایان": 2,
      روبیکا: 14,
      "سایت دیوار": 6,
      لینکدین: 12,
      "مراجعه حضوری": 10,
      "معرفی نمایندگان شرکت ستاره اول": 11,
      پیامک: 0,
    };

    return res.status(200).json({
      status: 200,
      result: {
        simNumber: targetSimCard?.number,
        cashPayment,
        installmentPayment:
          targetSimCard.price < 5000000 ? null : installmentPayment,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getFilterConfigs = async (req, res) => {
  try {
    const areaCode = [
      "0910",
      "0911",
      "0912",
      "0913",
      "0914",
      "0915",
      "0916",
      "0917",
      "0918",
      "0919",
      "0990",
      "0991",
      "0992",
      "0993",
    ];
    const maxPrice = (await simCardModel.findOne().sort({ price: -1 }).lean())
      ?.price;
    const minPrice = 0;
    const simcardType = [
      { name: "اعتباری", value: 0 },
      { name: "دائمی", value: 1 },
    ];
    const sort = [
      { name: "جدید ترین", value: 0 },
      { name: "ارزان ترین", value: 1 },
      { name: "گران ترین", value: 2 },
    ];
    const typeUsing = [
      { name: "صفر", value: 0 },
      { name: "کارکرده", value: 1 },
      { name: "دارای کد فعالسازی", value: 2 },
    ];
    const filterConfigs = {
      areaCode,
      maxPrice,
      minPrice,
      simcardType,
      sort,
      typeUsing,
    };

    return res.status(200).json({ status: 200, result: filterConfigs });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.callPricesSimCard = async (req, res) => {
  try {
    const { monthCount, prePayPercent, simcardId } = req.body;
    const existSimCard = await simCardModel.findById(simcardId).lean();

    const finalPrice =
      (monthCount / 12) *
        0.2 *
        (existSimCard.price - (existSimCard.price * prePayPercent) / 100) +
      existSimCard.price;
    const monthlyPay = Math.floor(finalPrice / monthCount);
    const prePayPrice = (existSimCard.price * prePayPercent) / 100;
    const remainingPrice =
      existSimCard.price - (existSimCard.price * prePayPercent) / 100;
    const totalProfit = finalPrice - existSimCard.price;

    if (!existSimCard) {
      return res.status(404).json({
        message: "Simcard Does not exist",
      });
    }

    const simCardPrice = {
      finalPrice,
      monthlyPay,
      prePayPrice,
      remainingPrice,
      simcardPrice: existSimCard.price,
      totalProfit,
    };

    return res.status(200).json({ status: 200, result: simCardPrice });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
