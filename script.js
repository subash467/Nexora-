// Initialize Map with Tamil Nadu coordinates (Coimbatore region)
        const map = L.map('map').setView([11.0168, 76.9558], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add field zones for Tamil Nadu
        const zones = [
            { bounds: [[11.0300, 76.9400], [11.0500, 76.9600]], name: 'Rice Zone', risk: 'medium', crop: 'Rice' },
            { bounds: [[10.9900, 76.9700], [11.0100, 76.9900]], name: 'Sugarcane Zone', risk: 'low', crop: 'Sugarcane' },
            { bounds: [[10.9700, 76.9300], [10.9900, 76.9500]], name: 'Cotton Zone', risk: 'low', crop: 'Cotton' }
        ];
        
        zones.forEach(zone => {
            const color = zone.risk === 'high' ? 'red' : zone.risk === 'medium' ? 'orange' : 'green';
            const rectangle = L.rectangle(zone.bounds, {
                color: color,
                weight: 2,
                fillOpacity: 0.3
            }).addTo(map);
            
            rectangle.bindPopup(`
                <strong>${zone.name}</strong><br>
                Crop: ${zone.crop}<br>
                Risk Level: ${zone.risk}<br>
                <button class="btn btn-sm btn-primary mt-2" onclick="focusOnZone('${zone.name}')">View Details</button>
            `);
            
            rectangle.on('click', function() {
                highlightZone(zone.name);
            });
        });

        // Add a marker for the main farm location
        L.marker([11.0168, 76.9558]).addTo(map)
            .bindPopup('<b>Coimbatore Agricultural Research Station</b><br>Center of monitoring operations')
            .openPopup();

        // Initialize Charts
        const ndviCtx = document.getElementById('ndviChart').getContext('2d');
        const ndviChart = new Chart(ndviCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'NDVI Index - Tamil Nadu Rice',
                    data: [0.55, 0.62, 0.68, 0.72, 0.75, 0.73],
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'NDVI Value'
                        }
                    }
                }
            }
        });

        const predictionCtx = document.getElementById('predictionChart').getContext('2d');
        const predictionChart = new Chart(predictionCtx, {
            type: 'line',
            data: {
                labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [{
                    label: 'Pest Risk Probability - Tamil Nadu',
                    data: [35, 42, 48, 52, 55, 53, 50],
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '7-Day Pest Risk Forecast - Tamil Nadu Region'
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Risk Probability %'
                        }
                    }
                }
            }
        });

        // Zone Card Interactions
        document.querySelectorAll('.zone-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelectorAll('.zone-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                const zoneName = this.dataset.zone;
                showZoneDetails(zoneName);
            });
        });

        function showZoneDetails(zoneName) {
            const zoneData = {
                'Rice Zone': { health: 78, issues: ['Irrigation needed'], recommendations: ['Schedule watering'] },
                'Sugarcane Zone': { health: 65, issues: ['Growth irregularity'], recommendations: ['Inspect soil nutrients'] },
                'Cotton Zone': { health: 82, issues: ['None'], recommendations: ['Continue current practices'] }
            };
            
            const data = zoneData[zoneName];
            alert(`Zone: ${zoneName}\nHealth: ${data.health}%\nIssues: ${data.issues.join(', ')}\nRecommendations: ${data.recommendations.join(', ')}`);
        }

        function focusOnZone(zoneName) {
            document.querySelectorAll('.zone-card').forEach(card => {
                if (card.dataset.zone === zoneName) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            showZoneDetails(zoneName);
        }

        // AI Disease Detection
        document.getElementById('diseaseImage').addEventListener('change', function(e) {
            const preview = document.getElementById('imagePreview');
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.classList.remove('d-none');
                }
                reader.readAsDataURL(this.files[0]);
            }
        });

        function analyzeDisease() {
            const analyzeBtn = document.getElementById('analyzeBtn');
            const resultsDiv = document.getElementById('aiResults');
            
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Analyzing...';
            analyzeBtn.disabled = true;
            
            setTimeout(() => {
                // Diseases common in Tamil Nadu agriculture
                const diseases = [
                    { name: 'Healthy', confidence: 85, description: 'No signs of disease detected' },
                    { name: 'Rice Blast', confidence: 72, description: 'Fungal infection detected' },
                    { name: 'Sugarcane Smut', confidence: 65, description: 'Fungal infection present' },
                    { name: 'Cotton Leaf Curl', confidence: 58, description: 'Viral infection detected' }
                ];
                
                const topDisease = diseases[Math.floor(Math.random() * diseases.length)];
                
                resultsDiv.innerHTML = `
                    <div class="alert ${topDisease.name === 'Healthy' ? 'alert-success' : 'alert-warning'}">
                        <h6><i class="fas fa-diagnoses me-1"></i> AI Diagnosis: ${topDisease.name}</h6>
                        <p class="mb-1">Confidence: ${topDisease.confidence}%</p>
                        <p class="mb-1">${topDisease.description}</p>
                        <small class="text-muted">Recommendation: ${getTreatmentRecommendation(topDisease.name)}</small>
                    </div>
                `;
                
                analyzeBtn.innerHTML = '<i class="fas fa-search me-1"></i> Analyze with AI';
                analyzeBtn.disabled = false;
            }, 2000);
        }

        function getTreatmentRecommendation(disease) {
            const recommendations = {
                'Healthy': 'Continue current practices',
                'Rice Blast': 'Apply appropriate fungicide treatment',
                'Sugarcane Smut': 'Use resistant varieties and fungicides',
                'Cotton Leaf Curl': 'Remove infected plants and control whiteflies'
            };
            return recommendations[disease] || 'Consult agricultural expert';
        }

        // Simulate live data updates
        setInterval(() => {
            if (document.getElementById('liveUpdateSwitch').checked) {
                // Update sensor values randomly
                const moisture = 40 + Math.random() * 20;
                const ndvi = 0.65 + Math.random() * 0.2;
                const temp = 28 + Math.random() * 8;
                
                document.querySelectorAll('.sensor-value')[0].textContent = Math.round(moisture) + '%';
                document.querySelectorAll('.sensor-value')[2].textContent = ndvi.toFixed(2);
                document.querySelectorAll('.sensor-value')[1].textContent = Math.round(temp) + '°C';
                
                // Update charts
                ndviChart.data.datasets[0].data.push(ndvi);
                ndviChart.data.labels.push('New');
                if (ndviChart.data.labels.length > 8) {
                    ndviChart.data.labels.shift();
                    ndviChart.data.datasets[0].data.shift();
                }
                ndviChart.update();
            }
        }, 5000);