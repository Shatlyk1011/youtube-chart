const generateRandomData = (numDatasets = 2, numPoints = 14) => {
  const randomDate = () => new Date(Date.now() - Math.random() * 1e12).toDateString();
  const randomNumbers = (length, max = 20) =>
    Array.from({ length }, () => Math.floor(Math.random() * max));

  // Generate mock data
  return {
    dates: Array.from({ length: numPoints }, randomDate),
    data: Array.from({ length: numDatasets }, (_, i) => ({
      name: `Dataset ${i + 1}`,
      data: randomNumbers(numPoints),
    })),
  };
};

//mock data
const mockData = generateRandomData();

//variables
const textColor = "#aaa";
const opacityColor = "rgba(255,255,255,0.1)";
const maxStepLength = 5;
const firstAndLastLength = 2;
const isLabelAvailable = true;
const CHART_COLORS = [
  "142, 140, 255",
  "188, 105, 243",
  "242,196,40",
  "65,180,217",
  "243, 126, 192",
  "236,161,27",
  "131,193,53",
];

const getMinusVal = (number, length) => {
  const ratio = Math.floor(length / number);
  return ratio >= 2 ? ratio : 1;
};

const { dates, data } = mockData;

let minus = dates?.length > 16 ? getMinusVal(20, dates.length) : 0;

//show calculated date labels
const labelIndexes = (function getIndicesElements(dates) {
  if (dates && dates.length > 7) {
    const indices = [];
    const firstElIdx = 0;
    const lastElIdx = dates.length - 1;
    const steps = Math.floor((dates.length - firstAndLastLength) / maxStepLength);
    let currentStep = 0;
    let bool = false;
    for (let i = 0; i < maxStepLength; i++) {
      currentStep = bool ? currentStep + steps : currentStep + steps - minus;
      indices.push(dates[currentStep]);
      bool = !bool;
    }
    const indexes = indices.map((idx) => dates.indexOf(idx));

    return [firstElIdx, ...indexes, lastElIdx];
  } else return dates?.map((idx) => dates.indexOf(idx));
})(dates);

const chartData = {
  labels: dates,
  datasets: data.map((stat, index) => {
    return {
      label: stat.name,
      data: stat.data,
      borderColor: `rgb(${CHART_COLORS[index] || CHART_COLORS[0]})`,
      backgroundColor: `rgb(${CHART_COLORS[index] || CHART_COLORS[0]}, 0.15)`,
      pointHoverBackgroundColor: `rgb(${CHART_COLORS[index] || CHART_COLORS[0]})`,
    };
  }),
};

const options = {
  datasets: {
    line: {
      pointBorderColor: "rgba(0, 0, 0, 0)",
      pointBackgroundColor: "rgb(0,0,0,0)",
      pointHitRadius: 50,
      fill: true,
      borderWidth: 2,
      borderJoinStyle: "bevel",
      pointBorderWidth: 5,
      pointHoverBorderColor: "rgba(0, 0, 0, 1)",
      animation: {
        duration: 0,
      },
    },
  },

  plugins: {
    tooltip: {
      titleColor: "#fff",
      backgroundColor: "rgb(35, 35, 35)",
      borderWidth: 1,

      borderColor: opacityColor,
      titleFont: { size: 14 },
      bodyFont: {
        size: isLabelAvailable ? 18 : 24,
        weight: "600",
        lineHeight: 1.2,
      },
      bodyColor: isLabelAvailable ? "#3ea6ff" : `rgb(${CHART_COLORS[0]})`,
      usePointStyle: false,
      padding: {
        x: 16,
        y: 14,
      },
      boxHeight: 0,
      boxWidth: 0,
    },

    legend: {
      display: isLabelAvailable,
      position: "top",
      align: "start",
      onHover: function (e) {
        e.native.target.style.cursor = "pointer";
      },
      onLeave: function (e) {
        e.native.target.style.cursor = "default";
      },

      labels: {
        boxHeight: 1,
        boxWidth: 10,
        padding: 12,
        useBorderRadius: true,
        color: textColor,
        pointStyleWidth: 23,
        font: { size: 14 },
      },
    },
  },
  scales: {
    x: {
      border: {
        color: textColor,
      },
      beginAtZero: true,
      ticks: {
        align: "inner",
        maxTicksLimit: 7,
        color: textColor,
        font: { size: 12 },
        callback(_, index) {
          let idxs = labelIndexes;
          if (idxs.includes(index)) return dates[index];
          return null;
        },
      },
      grid: {
        color: "transparent",
        tickColor: opacityColor,
      },
    },
    y: {
      border: {
        display: false,
      },
      position: "right",
      beginAtZero: true,

      ticks: {
        align: "inner",
        color: textColor,
        padding: 10,
        maxTicksLimit: 4,
        stepSize: 1,
      },
      grid: {
        color: opacityColor,
        lineWidth: 2,
        tickWidth: 0,
      },
    },
  },

  responsive: true,
  aspectRatio: 4 / 1,
};

const ctx = document.getElementById("lineChart").getContext("2d");

new Chart(ctx, {
  type: "line",
  data: chartData,
  options,
});
