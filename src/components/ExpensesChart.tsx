import { Chart } from "chart.js/auto";
import { useRef } from "react";
import Logo from "../image/logo.svg";
import CountUp from "react-countup";

//interface for chartdata makes sure the props have the correct type
interface ChartData {
  data: Array<{
    day: string,
    amount: number
  }>
}

function ExpensesChart(props: ChartData) {
  let delayed: boolean;
  const chartRef = useRef<Chart | null>(null);

  //drawing chart onto the canvas using chart.js
  const canvasCallback = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: props.data.map(row => row.day),
          datasets: [{
            data: props.data.map(row => row.amount),
            backgroundColor: function(context, options) {
              let amounts = props.data.map(row => row.amount);
              let max = amounts[0];
              let maxIndex = 0;

              amounts.forEach((amount, i) => {
                if(amount > max) {
                  max = amount;
                  maxIndex = i;
                }
              })
              options.color = context.dataIndex === maxIndex ? 'hsl(186, 34%, 60%)' : 'hsl(10, 79%, 65%)';
              return options.color;
            },
            hoverBackgroundColor: function(context, options) {
              let amounts = props.data.map(row => row.amount);
              let max = amounts[0];
              let maxIndex = 0;

              amounts.forEach((amount, i) => {
                if(amount > max) {
                  max = amount;
                  maxIndex = i;
                }
              })
              options.color = context.dataIndex === maxIndex ? 'hsla(186, 34%, 60%, 0.6)' : 'hsla(10, 79%, 65%, 0.6)';
              return options.color;
            },
            borderRadius: 5,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              border: {
                display: false
              },
              grid: {
                display: false
              }
            },
            y: {
              display: false,
            }
          },
          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            }
          },
          plugins: {
            legend: {
              display: false
            },
            //custom tooltip on hover
            tooltip: {
              enabled: false,
              external: function(context) {
                const tooltip = context.tooltip;
                let tooltipEl = context.chart.canvas.parentNode?.querySelector('div');

                if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
                  tooltipEl.style.borderRadius = '5px';
                  tooltipEl.style.color = 'white';
                  tooltipEl.style.opacity = '1';
                  tooltipEl.style.pointerEvents = 'none';
                  tooltipEl.style.position = 'absolute';
                  tooltipEl.style.transform = 'translate(-50%, 0)';
                  tooltipEl.style.transition = 'all .1s ease';

                  const table = document.createElement('table');
                  table.style.margin = '0px';

                  tooltipEl.appendChild(table);
                  context.chart.canvas.parentNode?.appendChild(tooltipEl);
                }

                if (tooltip.body) {
                  const bodyLines = tooltip.body.map(b => b.lines);

                  const tableBody = document.createElement('tbody');

                  bodyLines.forEach((body, i) => {
                    const tr = document.createElement('tr');
                    tr.style.borderWidth = '0';

                    const th = document.createElement('th');
                    th.style.borderWidth = '0';
                    const text = document.createTextNode('$' + body[i]);

                    th.appendChild(text);
                    tr.appendChild(th);
                    tableBody.appendChild(tr);
                  });

                  const tableRoot = tooltipEl.querySelector('table');

                  while (tableRoot?.firstChild) {
                    tableRoot.firstChild.remove();
                  };

                  tableRoot?.appendChild(tableBody);

                  const {offsetLeft: positionX, offsetTop: positionY} = context.chart.canvas;
                  tooltipEl.style.left = positionX + tooltip.caretX + "px";
                  tooltipEl.style.top = -20 + positionY + tooltip.caretY + "px";
                  tooltipEl.className = `opacity-100 text-[16px] text-light p-2`
                }
              }
            }
          }
        }
      }
    )}
  }

  //functions can be added later to calculate these values
  const totalBalance = 921.48;
  const monthlyTotal = 478.33;
  const monthlyPercentage = 2.4;

  return (
    <div className="w-[350px] desktop:w-[450px]" aria-label="chart showing my expenses">
      <header className="bg-soft-red rounded-xl flex justify-between p-5 desktop:p-7">
        <div className="flex-col justify-center">
          <h1 className="text-[16px] font-light text-very-pale-orange desktop:text-[18px]">My balance</h1>
          <h2 className="text-[24px] font-bold text-very-pale-orange desktop:text-[28px]">$<CountUp decimals={2} end={totalBalance} duration={2}/></h2>
        </div>
        <img src={Logo} alt="company logo"/>
      </header>
      <main className="flex-col items-start bg-very-pale-orange rounded-t-xl p-5 pt-3 pb-0 m-0 mt-5 desktop:p-10 rounded-t-2xl">
        <h1 className="text-[24px] font-bold text-dark-brown desktop:text-[28px]">Spending - Last 7 days</h1>
        <canvas className="mt-5" aria-label="chart showing spending for the last 7 days" ref={canvasCallback}>
        </canvas>
        <hr className="border-[1px] border-solid border-cream mt-5 mb-5 desktop:mb-0 mt-8"></hr>
      </main>
      <footer className="bg-very-pale-orange rounded-b-xl p-5 mt-[-20px] flex items-end justify-between desktop:pl-10 pr-10 pb-10 rounded-b-2xl">
        <div aria-label="spendings this month">
          <h1 className="text-[16px] font-light text-medium-brown">Total this month</h1>
          <p className="text-[32px] font-bold text-dark-brown p-0 m-0">$<CountUp decimals={2} end={monthlyTotal} duration={2}/></p>
        </div>
        <div aria-label="percentage compared to last month">
          <h1 className="text-[16px] font-bold text-dark-brown">+<CountUp decimals={1} end={monthlyPercentage} duration={2}/>%</h1>
          <p className="text-[16px] font-light text-medium-brown mb-2">from last month</p>
        </div>
      </footer>
    </div>
  );
}

export default ExpensesChart;