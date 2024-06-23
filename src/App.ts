import van from 'vanjs-core'
import { Chart, ChartData, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'

Chart.register(...registerables, MatrixController, MatrixElement)

type Heat = {
  x: string
  y: string
  d: string
  v: number
}

const URL = 'http://localhost:3001/heat'

const { section, header, h1, p, div, canvas, time, span, a } = van.tags

const fetchData = async <T>(url: string): Promise<T | undefined> => {
  try {
    const response = await fetch(URL)
    return response.json()
  } catch (error) {
    return undefined
  }
}

const getTime = () => new Date().toLocaleTimeString()

const Time = (refreshMs?: number | undefined) => {
  const currentTime = van.state(getTime())

  refreshMs &&
    setInterval(() => {
      currentTime.val = getTime()
    }, refreshMs)

  return time(currentTime)
}

/* Calls external API periodically if refreshMs is given. */
const Heatmap = async ({ refreshMs }: { refreshMs?: number | undefined }) => {
  const data = van.state(await fetchData<Heat[]>(URL))
  const currentTime = van.state(getTime())

  const chartCanvas = van.derive(() => {
    const datasets: ChartData<'matrix', Heat[]> = {
      datasets: [
        {
          label: 'Heat',
          data: data.val,
          parsing: {
            xAxisKey: 'x',
            yAxisKey: 'y'
          },
          backgroundColor(c) {
            //@ts-ignore
            const value = c.dataset.data[c.dataIndex]?.v
            const alpha = (10 + value) / 60
            return `rgba(0, 200, 0, ${alpha})`
          },
          borderColor: 'green',
          borderRadius: 1,
          borderWidth: 1,
          hoverBackgroundColor: `rgba(200, 200, 0, 1)`,
          hoverBorderColor: `rgba(0, 200, 0, 1)`,
          width(c) {
            const a = c.chart.chartArea
            if (a) {
              return (a.right - a.left) / 53 - 1
            }
          },
          height(c) {
            const a = c.chart.chartArea
            if (a) {
              return (a.bottom - a.top) / 7 - 1
            }
          }
        }
      ]
    }

    const chartObj = new Chart(canvas(), {
      type: 'matrix',
      data: datasets,
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'time',
            offset: true,
            time: {
              unit: 'day',
              round: 'day',
              isoWeekday: 1,
              parser: 'i',
              displayFormats: {
                day: 'iiiiii'
              }
            },
            reverse: true,
            position: 'right',
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              padding: 1,
              font: {
                size: 9
              }
            },
            grid: {
              display: false
            }
          },
          x: {
            type: 'time',
            position: 'bottom',
            offset: true,
            time: {
              unit: 'week',
              round: 'week',
              isoWeekday: 1,
              displayFormats: {
                week: 'MMM dd'
              }
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              font: {
                size: 9
              }
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              title() {
                return ''
              },
              label(context) {
                const v = context.dataset.data[context.dataIndex]
                //@ts-ignore
                return ['date: ' + v.d, 'value: ' + v.v.toFixed(2)]
              }
            }
          }
        }
      }
    })

    return div({ class: 'chart-container' }, chartObj.canvas)
  })

  refreshMs &&
    setInterval(async () => {
      const updatedData = await fetchData<Heat[]>(URL)
      if (updatedData) {
        data.val = updatedData
        currentTime.val = getTime()
      }
    }, refreshMs)

  return div(
    span(
      // State-derived child node
      () => chartCanvas.val,
      span('Chart refreshed at '),
      time(currentTime)
    )
  )
}

const Header = () =>
  header(
    h1('VanJS + chart.js heatmap'),
    p('Chart.js heatmap (matrix) using VanJS and Typescript'),
    p(
      'Chart based on example at ',
      a({ href: 'https://www.youtube.com/watch?v=185_Ofuq7T0' }, 'https://www.youtube.com/watch?v=185_Ofuq7T0')
    ),
    div(span('Started at '), Time()),
    div(span('Current time '), Time(1000))
  )

export const App = async () => {
  return section({ class: 'app' }, Header(), await Heatmap({ refreshMs: 60000 }))
}
