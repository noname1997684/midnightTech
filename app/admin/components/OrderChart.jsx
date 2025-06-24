"use client"

import { Bar, Line } from "react-chartjs-2"
import  { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, scales, BarElement } from "chart.js"


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)
const OrderChart = ({items}) => {
    const data ={
        labels: items?.map((item) => item.date),
        datasets: [
            {
                label: "Total Orders",
                data: items?.map((item) => item.data.totalOrders),
                backgroundColor: "#879fff20",
                borderColor: "#879fff80",
                borderWidth: 1,
                barThickness: 40,
            },
        ],
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Total Orders Bar Chart",
            },
        },
        scales: {
            x: {
                grid:{
                    display: false,
                }
            },
            y: {
                beginAtZero: true,
            },
        },
    }
  return (
    <section className="bg-white p-5 rounded-xl shadow w-full h-[430px] ">
        <Bar data={data} options={options}/>
    </section>
  )
}

export default OrderChart