import echarts from "echarts";
import { merge } from "lodash";

const appearance = {
  linechart: (type) => {
    const defaultOption = {
      baseOption: {
        title: {
          textStyle: {
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 18,
            lineHeight: 24,
            color: "#0D3C44",
          },
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          backgroundColor: "#153556",
          textStyle: {
            fontFamily: "Public Sans",
            fontStyle: "normal",
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(39,57,57,0.15)",
            },
          },
        },
        label: {
          show: true,
          color: "#666666",
          position: "top",
          fontFamily: "Public Sans",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: 11,
        },
        color: [
          "#F98561",
          "#FDB949",
          "#427E89",
          "#38BC9A",
          "#9665CD",
          "#EE87BD",
          "#5176BD",
          "#55B6EB",
        ],
        legend: {
          show: false,
          right: "4%",
          textStyle: {
            color: "#637B7B",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 13,
          },
          type: "scroll",
        },
        grid: {
          bottom: "0px",
          right: "1%",
          left: "1%",
          containLabel: false,
        },
        xAxis: {
          show: false,
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#97AEB2",
            },
          },
          axisLabel: {
            color: "#89A0A5",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 14,
          },
        },
        yAxis: {
          show: false,
          type: "value",
          scale: true,
          axisLine: {
            lineStyle: {
              color: "#97AEB2",
            },
          },
          axisLabel: {
            color: "#89A0A5",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              color: "#D2DCDD",
            },
          },
        },
      },
      media: [
        {
          query: {
            maxWidth: 368,
          },
          option: {
            legend: {
              top: "8%",
              orient: "horizontal",
              left: "0",
            },
            grid: {
              bottom: "10%",
            },
          },
        },
      ],
    };
    switch (type) {
      case "thomas-chart":
        return merge(defaultOption, {
          baseOption: {
            series: {
              0: {
                name: "注册总量",
                type: "line",
                showAllSymbol: true,
                symbol: "circle",
                symbolSize: 5,
                lineStyle: {
                  normal: {
                    color: "#6c50f3",
                    shadowColor: "rgba(0, 0, 0, .3)",
                    shadowBlur: 0,
                    shadowOffsetY: 5,
                    shadowOffsetX: 5,
                  },
                },
                label: {
                  show: false,
                  position: "top",
                  textStyle: {
                    color: "#6c50f3",
                  },
                },
                itemStyle: {
                  color: "#6c50f3",
                  borderColor: "#fff",
                  borderWidth: 3,
                  shadowColor: "rgba(0, 0, 0, .3)",
                  shadowBlur: 0,
                  shadowOffsetY: 2,
                  shadowOffsetX: 2,
                },
                tooltip: {
                  show: true,
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: "rgba(108,80,243,0.3)",
                        },
                        {
                          offset: 1,
                          color: "rgba(108,80,243,0)",
                        },
                      ],
                      false,
                    ),
                    shadowColor: "rgba(108,80,243, 0.9)",
                    shadowBlur: 20,
                  },
                },
              },
            },
          },
        });
      case "vertical-legend":
        return merge(defaultOption, {
          baseOption: {
            legend: {
              textStyle: {
                color: "#637B7B",
                fontFamily: "Public Sans",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: 13,
              },
              right: "0",
              top: "middle",
              orient: "vertical",
              type: "scroll",
            },
            grid: {
              left: "1%",
              right: "8%",
              bottom: "0",
              containLabel: true,
            },
          },
        });
      case "linechartWithAxis":
        return merge(defaultOption, {
          baseOption: {
            title: {
              textStyle: {
                fontFamily: "Public Sans",
                fontStyle: "normal",
                fontWeight: "bold",
                fontSize: 18,
                lineHeight: 24,
                color: "#0D3C44",
              },
            },
            tooltip: {
              trigger: "axis",
              confine: true,
              backgroundColor: "#153556",
              textStyle: {
                fontFamily: "Public Sans",
                fontStyle: "normal",
              },
              axisPointer: {
                type: "shadow",
                shadowStyle: {
                  color: "rgba(39,57,57,0.15)",
                },
              },
            },
            label: {
              show: false,
            },
            color: [
              "#0190d2",
              "#FDB949",
              "#427E89",
              "#38BC9A",
              "#9665CD",
              "#EE87BD",
              "#5176BD",
              "#55B6EB",
            ],
            legend: {
              show: false,
              right: "4%",
              textStyle: {
                color: "#637B7B",
                fontFamily: "Public Sans",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: 13,
              },
              type: "scroll",
            },
            grid: {
              bottom: 30,
              top: 40,
              right: "1%",
              left: 40,
              containLabel: true,
            },
            xAxis: {
              show: true,
              type: "category",
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              axisLabel: {
                color: "#89A0A5",
                fontFamily: "Public Sans",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: 14,
              },
            },
            yAxis: {
              show: true,
              type: "value",
              scale: true,
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              axisLabel: {
                show: true,
                color: "#8A8A8A",
                fontFamily: "Public Sans",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: 14,
              },
              axisTick: {
                show: true,
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#D2DCDD",
                },
              },
            },
          },
          media: [
            {
              query: {
                maxWidth: 600,
              },
              option: {
                grid: {
                  bottom: 30,
                },
                yAxis: {
                  show: true,
                  type: "value",
                  scale: true,
                  axisLine: {
                    show: true,
                  },
                  axisLabel: {
                    show: true,
                    color: "#8A8A8A",
                    fontFamily: "Public Sans",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    fontSize: 14,
                  },
                  axisTick: {
                    show: false,
                  },
                  splitLine: {
                    show: false,
                    lineStyle: {
                      color: "#D2DCDD",
                    },
                  },
                },
              },
            },
          ],
        });
      case "linechartOverview":
        return merge(defaultOption, {
          media: [
            {
              query: {
                maxWidth: 1366,
              },
              option: {
                label: {
                  fontSize: 10,
                },
                xAxis: {
                  axisLabel: {
                    fontSize: 10,
                  },
                  axisLine: {
                    lineStyle: {
                      color: "#D6D6D9",
                    },
                  },
                },
                yAxis: {
                  show: false,
                  axisTick: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                },
                grid: {
                  bottom: 0,
                  left: 0,
                  right: 0,
                  containLabel: true,
                },
              },
            },
            {
              query: {
                maxWidth: 980,
              },
              option: {
                label: {
                  fontSize: 10,
                },
                xAxis: {
                  axisLabel: {
                    fontSize: 10,
                  },
                },
                yAxis: {
                  show: false,
                  axisTick: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                },
                grid: {
                  bottom: 10,
                  left: 0,
                  right: 0,
                  containLabel: true,
                },
              },
            },
          ],
        });

      default:
        return defaultOption;
    }
  },
  barchart: (type) => {
    const defaultOption = {
      baseOption: {
        color: [
          "#55B6EB",
          "#F98561",
          "#FDB949",
          "#427E89",
          "#38BC9A",
          "#9665CD",
          "#EE87BD",
          "#5176BD",
          "#55B6EB",
        ],
        title: {
          textStyle: {
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 18,
            lineHeight: 24,
            color: "#0D3C44",
          },
        },
        label: {
          show: true,
          color: "#666666",
          position: "top",
          fontFamily: "Public Sans",
          fontStyle: "normal",
          textTransform: "uppercase !important",
          fontWeight: 700,
          fontSize: 11,
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          backgroundColor: "#153556",
          textStyle: {
            fontFamily: "Public Sans",
            fontStyle: "normal",
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(39,57,57,0.15)",
            },
          },
        },
        grid: {
          bottom: "20px",
          right: "1%",
          left: "1%",
          top: "16% !important",
          containLabel: false,
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#D6D6D9",
            },
          },
          axisLabel: {
            color: "#89A0A5",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 14,
            // interval: 0,
            // overflow: 'break'
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "#D2DCDD",
            },
          },
        },
        yAxis: {
          type: "value",
          show: false,
          axisLine: {
            lineStyle: {
              color: "#97AEB2",
            },
          },
          axisLabel: {
            color: "#89A0A5",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            textTransform: "uppercase !important",
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              color: "#D2DCDD",
            },
          },
        },
        legend: {
          show: false,
          left: "4%",
          textStyle: {
            textTransform: "uppercase !important",
            color: "#637B7B",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 13,
          },
          type: "scroll",
        },
        orientation: "horizontal",
        series: [],
      },
    };
    switch (type) {
      case "scrollBar":
        return merge(defaultOption, {
          baseOption: {
            grid: {
              bottom: "70px",
            },
            xAxis: {
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
            },
          },
          media: [
            {
              query: {
                maxWidth: 368,
              },
              option: {
                grid: {
                  top: "10%",
                  bottom: "70px",
                },
              },
            },
            {
              query: {
                maxWidth: 981,
              },
              option: {
                grid: {
                  top: "10%",
                  bottom: "70px",
                },
              },
            },
          ],
        });
      case "mapaBar":
        return merge(defaultOption, {
          baseOption: {
            series: [
              {
                barwidth: 250,
              },
            ],
          },
        });
      case "alignToScatter":
        return merge(defaultOption, {
          baseOption: {
            grid: {
              bottom: "15%",
            },
            xAxis: {
              axisLabel: {
                fontSize: 12,
              },
            },
          },
          media: [
            {
              query: {
                maxWidth: 368,
              },
              option: {
                grid: {
                  bottom: "20%",
                },
              },
            },
          ],
        });
      case "HorizontalProps":
        return merge(defaultOption, {
          baseOption: {
            color: ["#38BC9A", "#55B6EB", "#F98561"],
            yAxis: {
              type: "category",
              inverse: true,
              show: true,
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
            },
            xAxis: {
              type: "value",
              show: false,
              axisLine: {
                show: false,
              },
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              boundaryGap: 0,
              minorTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
            },
            tooltip: {
              trigger: "axis",
            },
            label: {
              position: "right",
            },
            grid: {
              right: "20%",
              left: "20%",
              bottom: "0%",
              top: "5%",
              containLabel: true,
            },
            series: [],
          },
          media: [],
        });
      case "HorizontalPositivacao":
        return merge(defaultOption, {
          baseOption: {
            title: {
              left: "center",
              textStyle: {
                color: "#8a8a8a",
                fontSize: 13,
                fontFamily: "Public Sans",
                lineHeight: 16,
                fontWeight: 800,
              },
              top: -5,
            },
            xAxis: {
              type: "value",
              show: false,
            },
            yAxis: {
              type: "category",
              inverse: false,
              show: true,
              axisTick: {
                alignWithLabel: true,
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
            },
            grid: {
              bottom: "0",
              right: "1%",
              left: "1%",
              top: "8%",
              containLabel: false,
            },
          },
        });
      case "HorizontalLeft":
        return merge(defaultOption, {
          baseOption: {
            title: {
              left: "center",
              textStyle: {
                color: "#8a8a8a",
                fontSize: 13,
                fontFamily: "Public Sans",
                lineHeight: 16,
                fontWeight: 800,
              },
              top: -5,
            },
            xAxis: {
              type: "value",
              show: false,
            },
            yAxis: {
              type: "category",
              inverse: false,
              show: true,
              axisTick: {
                alignWithLabel: true,
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              label: {
                show: true,
              },
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
            },
            grid: {
              bottom: "0",
              right: "1%",
              left: "1%",
              top: "8%",
              containLabel: true,
            },
          },
          media: [
            {
              query: {
                maxWidth: 368,
              },
              option: {
                grid: {
                  top: "10%",
                  bottom: "5%",
                },
              },
            },
            {
              query: {
                maxWidth: 981,
              },
              option: {
                grid: {
                  top: "10%",
                  bottom: "5%",
                },
              },
            },
          ],
        });
      case "HorizontalLeftPositivacao":
        return merge(defaultOption, {
          baseOption: {
            title: {
              left: "center",
              textStyle: {
                color: "#8a8a8a",
                fontSize: 13,
                fontFamily: "Public Sans",
                lineHeight: 16,
                fontWeight: 800,
              },
              top: -5,
            },
            xAxis: {
              type: "value",
              show: false,
            },
            yAxis: {
              type: "category",
              inverse: false,
              show: true,
              axisTick: {
                alignWithLabel: true,
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              label: {
                show: true,
              },
            },
            grid: {
              bottom: "0",
              right: "1%",
              left: "1%",
              top: "8%",
              containLabel: true,
            },
          },
        });
      case "HorizontalRight":
        return merge(defaultOption, {
          baseOption: {
            title: {
              left: "center",
              textStyle: {
                color: "#8a8a8a",
                fontSize: 13,
                fontFamily: "Public Sans",
                lineHeight: 16,
                fontWeight: 800,
              },
              top: -5,
            },
            xAxis: {
              type: "value",
              show: false,
              label: {
                show: false,
              },
            },
            yAxis: {
              type: "category",
              inverse: false,
              show: true,
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              axisLabel: {
                show: false,
              },
            },
            grid: {
              bottom: "0",
              right: "1%",
              left: "1%",
              top: "8%",
              containLabel: true,
            },
          },
          media: [
            {
              query: {
                maxWidth: 368,
              },
              option: {
                grid: {
                  top: "10%",
                  bottom: "5%",
                },
              },
            },
            {
              query: {
                maxWidth: 981,
              },
              option: {
                grid: {
                  top: "10%",
                  bottom: "5%",
                },
              },
            },
          ],
        });
      case "mix":
        return merge(defaultOption, {
          baseOption: {
            grid: {
              bottom: "0",
              top: "10%",
              left: "15%",
              right: "15%",
              containLabel: true,
            },
          },
          media: [
            {
              query: {
                maxWidth: 980,
              },
              option: {
                grid: {
                  left: "0%",
                  right: "0%",
                  top: "15%",
                  bottom: "5%",
                },
                yAxis: {
                  show: false,
                  axisTick: {
                    show: false,
                  },
                  axisLine: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                },
              },
            },
            {
              query: {
                maxWidth: 1600,
              },
              option: {
                grid: {
                  left: "10%",
                  right: "10%",
                },
              },
            },
          ],
        });
      case "mixRotate":
        return merge(defaultOption, {
          baseOption: {
            grid: {
              bottom: "0",
              top: "10%",
              left: "15%",
              right: "15%",
              containLabel: true,
            },
          },
          media: [
            {
              query: {
                maxWidth: 1600,
              },
              option: {
                xAxis: {
                  axisLabel: {
                    rotate: 45,
                  },
                },
                yAxis: {
                  show: false,
                  axisTick: {
                    show: false,
                  },
                  axisLine: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                },
                grid: {
                  left: "10%",
                  right: "10%",
                },
              },
            },
          ],
        });
      case "barchartOverview":
        return merge(defaultOption, {
          baseOption: {
            xAxis: {
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
            },
          },
          media: [
            {
              query: {
                maxWidth: 1366,
              },
              option: {
                label: {
                  fontSize: 10,
                },
                xAxis: {
                  axisLabel: {
                    fontSize: 10,
                  },
                  axisTick: {
                    show: true,
                    alignWithLabel: true,
                  },
                },
                yAxis: {
                  show: false,
                  axisTick: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                },
                grid: {
                  bottom: 0,
                  left: 0,
                  right: 0,
                  containLabel: true,
                },
              },
            },
          ],
        });
      case "positivacaoMobile":
        return merge(defaultOption, {
          media: [
            {
              query: {
                maxWidth: 980,
              },
              option: {
                label: {
                  fontSize: 10,
                },
                xAxis: {
                  axisLabel: {
                    fontSize: 10,
                  },
                },
                yAxis: {
                  show: false,
                  axisTick: {
                    show: false,
                  },
                  axisLabel: {
                    show: false,
                  },
                },
                grid: {
                  bottom: 0,
                  left: 0,
                  right: 0,
                  containLabel: true,
                },
              },
            },
          ],
        });
      default:
        return defaultOption;
    }
  },
  gaugeChart: (type) => {
    const defaultOption = {
      baseOption: {
        colors: [
          "rgba(233,82,72,1)",
          "rgba(253,185,73,1)",
          "rgba(56,188,154,1)",
        ],
        series: {
          opacity: {
            center: ["50%", "60%"],
            radius: "100%",
            type: "gauge",
            axisLine: {
              lineStyle: {
                width: -8,
                opacity: 0.2,
              },
            },
            splitLine: {
              show: true,
              length: 10,
              lineStyle: {
                color: "#89A0A5",
                width: 1,
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#89A0A5",
              fontSize: 13,
              fontFamily: "Public Sans",
              fontStyle: "normal",
              fontWeight: "normal",
            },
            pointer: { show: true, width: 4, length: "55%" },
            detail: {
              fontSize: 20,
              fontFamily: "Public Sans",
              fontStyle: "normal",
              fontWeight: "bolder",
              offsetCenter: [0, 50],
              padding: 20,
              lineHeight: 20,
            },
          },
          currentValue: {
            center: ["50%", "60%"],
            radius: "100%",
            type: "gauge",
            axisLine: {
              lineStyle: {
                width: -8,
                opacity: 1,
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            pointer: { show: false },
            axisLabel: { show: false },
            detail: { show: false },
          },
        },
      },
      media: [
        {
          query: {
            maxWidth: 500, // when container width is smaller than 500
          },
          option: {
            series: [
              // top and bottom layout of two pie charts
              {
                radius: "70%",
              },
              {
                radius: "70%",
              },
            ],
          },
        },
      ],
    };
    switch (type) {
      case "simpleGauge":
        return merge(defaultOption, {
          baseOption: {
            series: {
              opacity: {
                startAngle: 180,
                endAngle: 0,
                pointer: { show: false },
                detail: {
                  fontSize: 40,
                  fontFamily: "Public Sans",
                  fontStyle: "normal",
                  fontWeight: "bolder",
                  offsetCenter: [0, -10],
                  padding: 0,
                  lineHeight: 40,
                },
              },
              currentValue: {
                startAngle: 180,
                endAngle: 0,
              },
            },
          },
          media: [
            {
              series: [
                { center: ["45%", "20%"], radius: "28%" },
                { center: ["45%", "20%"], radius: "28%" },
              ],
            },
          ],
        });
      default:
        return defaultOption;
    }
  },
  scatter: (type) => {
    const defaultOption = {
      title: {
        textStyle: {
          fontFamily: "Public Sans",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: 18,
          lineHeight: 24,
          color: "#0D3C44",
        },
      },
      grid: {
        left: "1%",
        right: "1%",
        bottom: "0",
        containLabel: true,
      },
      color: [
        "#F98561",
        "#FDB949",
        "#427E89",
        "#38BC9A",
        "#9665CD",
        "#EE87BD",
        "#5176BD",
        "#55B6EB",
      ],
      xAxis: {
        axisLine: {
          lineStyle: {
            color: "#97AEB2",
          },
        },
        axisLabel: {
          color: "#89A0A5",
          fontFamily: "Public Sans",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: 14,
        },
        splitLine: {
          lineStyle: {
            color: "#D2DCDD",
          },
        },
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#97AEB2",
          },
        },
        axisLabel: {
          color: "#89A0A5",
          fontFamily: "Public Sans",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: 14,
        },
        splitLine: {
          lineStyle: {
            color: "#D2DCDD",
          },
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(39,57,57,0.9)",
        textStyle: {
          fontFamily: "Public Sans",
          fontStyle: "normal",
        },
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(39,57,57,0.15)",
          },
        },
      },
      series: {
        default: {
          type: "scatter",
        },
      },
    };
    switch (type) {
      default:
        return defaultOption;
    }
  },
  waterfall: (type) => {
    const defaultOption = {
      baseOption: {
        title: {
          textStyle: {
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 18,
            lineHeight: 24,
            color: "#0D3C44",
          },
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "0%",
          top: "5%",
          containLabel: true,
        },
        legend: {
          show: false,
        },
        color: [
          "#F98561",
          "#FDB949",
          "#427E89",
          "#38BC9A",
          "#9665CD",
          "#EE87BD",
          "#5176BD",
          "#55B6EB",
        ],
        xAxis: {
          type: "value",
          show: false,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#97AEB2",
            },
          },
          axisLabel: {
            show: false,
            color: "#89A0A5",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              color: "#D2DCDD",
            },
          },
        },
        yAxis: {
          type: "category",
          show: true,
          axisLine: {
            lineStyle: {
              color: "#97AEB2",
            },
          },
          axisLabel: {
            color: "#89A0A5",
            fontFamily: "Public Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              color: "#D2DCDD",
            },
          },
          axisTick: {
            show: false,
          },
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          backgroundColor: "rgba(39,57,57,0.9)",
          textStyle: {
            fontFamily: "Public Sans",
            fontStyle: "normal",
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(39,57,57,0.15)",
            },
          },
        },
        series: [],
      },
      media: [
        {
          query: {
            maxWidth: 368,
          },
          option: {
            legend: {
              top: "8%",
            },
            grid: {
              bottom: "10%",
            },
          },
        },
      ],
    };
    switch (type) {
      case "waterfallPositivacao":
        return merge(defaultOption, {
          baseOption: {
            yAxis: {
              inverse: true,
              axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
            },
          },
        });
      case "waterfallOverview":
        return merge(defaultOption, {
          baseOption: {
            yAxis: {
              inverse: true,
            },
          },
        });
      case "waterfallPreco":
        return merge(defaultOption, {
          baseOption: {
            width: "100%",
            yAxis: {
              inverse: true,
              axisTick: {
                show: true,
                alignWithLabel: true,
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              axisLine: {
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
            },
          },
          media: [
            {
              query: {
                maxWidth: 368,
              },
              option: {
                grid: {
                  bottom: "0%",
                },
              },
            },
          ],
        });
      case "waterfallMapa":
        return merge(defaultOption, {
          baseOption: {
            width: "100%",
            grid: {
              bottom: "0px",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              show: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#D6D6D9",
                },
              },
              axisLabel: {
                show: true,
                color: "#89A0A5",
                fontFamily: "Public Sans",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: 14,
                interval: 0,
              },
              splitLine: {
                lineStyle: {
                  color: "#D2DCDD",
                },
              },
            },
            yAxis: {
              type: "value",
              show: false,
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: false,
              },
              axisLine: {
                show: false,
              },
            },
          },
          media: [
            {
              query: {
                maxWidth: 368,
              },
              option: {
                grid: {
                  bottom: "5px",
                },
              },
            },
          ],
        });
      default:
        return defaultOption;
    }
  },
};
export default appearance;
