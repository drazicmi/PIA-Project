import { Component, OnInit } from '@angular/core';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { User } from 'src/app/models/user';
import { DecoratorService } from 'src/app/services/decorator.service';

@Component({
  selector: 'app-decorator-statistics',
  templateUrl: './decorator-statistics.component.html',
  styleUrls: ['./decorator-statistics.component.css']
})
export class DecoratorStatisticsComponent implements OnInit {


  decorator : User = new User();



  constructor(private decoratorService: DecoratorService) {
    // Register only the required components for bar, pie, and histogram charts
    Chart.register(CategoryScale, LinearScale, BarController, BarElement, PieController, ArcElement, Tooltip, Legend, Title);
  }

  ngOnInit(): void {
    let tmp = localStorage.getItem('logged');
    if (tmp) {
      this.decorator = JSON.parse(tmp);
      this.renderBarChart(this.decorator._id);
      this.renderPieChart(this.decorator.firmName);
      this.renderHistogramChart(this.decorator._id);
    }


  }

  renderBarChart(decoratorID: string) {
    this.decoratorService.getJobsPerMonth(decoratorID).subscribe(data => {
      const canvas = document.getElementById('barChart') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.months,  // Now contains ["9-2024", "10-2024", etc.]
            datasets: [{
              label: 'Number of Jobs',
              data: data.jobsCount,  // Contains the corresponding job count
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: { title: { display: true, text: 'Months' }},
              y: { title: { display: true, text: 'Number of Jobs' }}
            }
          }
        });
      }
    });

  }

  renderPieChart(firmName: string) {
    this.decoratorService.getJobDistributionForFirm(firmName).subscribe(data => {
      const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: data.decoratorNames, // Use the decorator names from backend
            datasets: [{
              label: 'Job Distribution',
              data: data.jobCounts, // Update this to use `jobCounts` from backend
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)', // Add more colors if needed
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)', // Add more colors if needed
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return `${data.decoratorNames[tooltipItem.dataIndex]}: ${data.jobCounts[tooltipItem.dataIndex]} jobs`;
                  }
                }
              }
            }
          }
        });
      }
    });
  }

  renderHistogramChart(decoratorID: string) {
    this.decoratorService.getAverageJobsPerDay(decoratorID).subscribe(data => {
      const canvas = document.getElementById('histogramChart') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        // Mapping from dayOfWeek numbers to day names
        const dayLabelsMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Mapping the data received from the backend
        const dayLabels = data.map(entry => dayLabelsMap[entry.dayOfWeek - 1]); // Subtract 1 because array is 0-indexed
        const avgJobsData = data.map(entry => entry.averageJobCount); // [0.0417, 0.0417, ...]

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dayLabels,
            datasets: [{
              label: 'Average Jobs Per Day',
              data: avgJobsData,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Day of the Week'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Average Jobs'
                },
                beginAtZero: true // Ensure the y-axis starts at 0
              }
            },
            responsive: true,
            plugins: {
              legend: {
                display: false // Hide legend if not necessary
              }
            }
          }
        });
      }
    });
  }

}
