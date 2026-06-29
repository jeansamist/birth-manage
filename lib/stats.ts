export function getMonthlyStats(
  births: any[],
  filter1: (b: any) => boolean,
  filter2: (b: any) => boolean
) {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
  const data = []
  
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthIndex = d.getMonth()
    const year = d.getFullYear()
    
    // Filter births created in this month and year
    const birthsInMonth = births.filter((b) => {
      const bDate = new Date(b.createdAt || b.updatedAt)
      return bDate.getMonth() === monthIndex && bDate.getFullYear() === year
    })
    
    data.push({
      month: `${months[monthIndex]} ${year.toString().slice(-2)}`,
      series1: birthsInMonth.filter(filter1).length,
      series2: birthsInMonth.filter(filter2).length,
    })
  }
  
  return data
}
