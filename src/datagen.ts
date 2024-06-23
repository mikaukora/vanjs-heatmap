const isoDayOfWeek = (dt: Date): string => {
  let wd = dt.getDay() // 0..6, from sun
  wd = ((wd + 6) % 7) + 1 // 1..7, from mon
  return '' + wd
}

const generateData = () => {
  const d = new Date()
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
  const data = []
  const end = today
  let dt = new Date(new Date().setDate(end.getDate() - 365))
  while (dt <= end) {
    const iso = dt.toISOString().substring(0, 10)
    data.push({
      x: iso,
      y: isoDayOfWeek(dt),
      d: iso,
      v: Math.random() * 50
    })
    dt = new Date(dt.setDate(dt.getDate() + 1))
  }
  return data
}

// Main execution block
if (require.main === module) {
  const data = generateData()
  console.log(JSON.stringify({ heat: data }, null, 2))
}
