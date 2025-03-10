// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const components = {
        tech: [
            { id: "ai", name: "AI-Driven Analytics", description: "Predictive modeling, outbreak tracking, and decision support." },
            { id: "iot", name: "IoT-Enabled Monitoring", description: "Wearable devices for patient vitals and medical supply tracking." },
            { id: "blockchain", name: "Blockchain for Data Integrity", description: "Secure and tamper-proof medical records and data exchange." },
            { id: "cloud", name: "Cloud-Based Collaboration Tools", description: "Secure telemedicine, real-time data access, and interoperability." },
            { id: "cyber", name: "Cybersecurity Frameworks", description: "Encryption, multi-factor authentication, and perimeterless security." }
        ],
        process: [
            { id: "data-sharing", name: "Real-Time Data Sharing", description: "AI-powered dashboards, APIs for system compatibility." },
            { id: "telemedicine", name: "Remote Diagnostics & Telemedicine", description: "AI-assisted diagnostics, IoT-powered patient monitoring." },
            { id: "resource-allocation", name: "Healthcare Resource Allocation", description: "AI-driven logistics, blockchain-tracked vaccine distribution." },
            { id: "privacy", name: "Data Privacy Compliance", description: "End-to-end encryption, risk assessments, and regular audits." }
        ],
        human: [
            { id: "providers", name: "Healthcare Providers", description: "Doctors and frontline workers leveraging AI insights." },
            { id: "it-specialists", name: "IT Specialists", description: "Cybersecurity experts ensuring system stability and compliance." },
            { id: "policy-makers", name: "Policy Makers", description: "Regulating cross-border data exchange and legal standards." }
        ]
    };

    const dependencies = [
        { source: "ai", target: "data-sharing" },
        { source: "iot", target: "data-sharing" },
        { source: "blockchain", target: "data-sharing" },
        { source: "cloud", target: "telemedicine" },
        { source: "cyber", target: "privacy" },
        { source: "data-sharing", target: "providers" },
        { source: "telemedicine", target: "providers" },
        { source: "resource-allocation", target: "policy-makers" },
        { source: "privacy", target: "it-specialists" },
        
        // Additional dependencies for connectivity
        { source: "iot", target: "cloud" }, // IoT data to cloud storage
        { source: "blockchain", target: "resource-allocation" }, // Blockchain for vaccine tracking
        { source: "cyber", target: "it-specialists" }, // Cybersecurity oversight
        { source: "providers", target: "policy-makers" }, // Feedback loop
        { source: "it-specialists", target: "cloud" }, // IT support for cloud infrastructure
    ];

    const riskStrategies = {
        "ai": "AI-Driven Threat Detection",
        "iot": "Redundant Sensors & Multi-Network Protocols (5G, Wi-Fi)",
        "cloud": "Multi-Cloud Strategies & Automated Data Backups",
        "blockchain": "Off-Chain Storage Solutions & Smart Contracts"
    };

    // D3.js Visualization Setup
    const svg = d3.select("#dependency-svg");
    const width = document.querySelector('#dependency-svg').clientWidth;
    const height = 600;

    svg.attr("viewBox", [0, 0, width, height]);

    // Force simulation setup
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(150).strength(1))
        .force("charge", d3.forceManyBody().strength(-800))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide(50));

    // Create nodes and links
    const nodes = [...components.tech, ...components.process, ...components.human];
    const links = dependencies.map(d => ({
        source: nodes.find(n => n.id === d.source),
        target: nodes.find(n => n.id === d.target)
    }));

    // Arrowhead definition
    svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#4a90e2");

    // Create links
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke", "#4a90e2")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrowhead)");

    // Create nodes
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

    // Node circles
    node.append("circle")
        .attr("r", 20)
        .attr("fill", d => {
            switch (true) {
                case components.tech.includes(d): return "#3498db";
                case components.process.includes(d): return "#2ecc71";
                case components.human.includes(d): return "#e74c3c";
                default: return "#ccc";
            }
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

    // Node icons
    node.append("text")
        .attr("class", "node-icon")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("font-family", "FontAwesome")
        .attr("fill", "white")
        .text(d => {
            const icons = {
                "ai": "\uf5dc",
                "iot": "\uf1eb",
                "blockchain": "\uf0c1",
                "cloud": "\uf0c2",
                "cyber": "\uf3ed",
                "data-sharing": "\uf1c0",
                "telemedicine": "\uf0fa",
                "resource-allocation": "\uf0d1",
                "privacy": "\uf023",
                "providers": "\uf0f0",
                "it-specialists": "\uf109",
                "policy-makers": "\uf24e"
            };
            return icons[d.id] || "\uf111";
        });

    // Node labels
    const labels = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .text(d => d.name)
        .attr("font-size", "12px")
        .attr("dx", 25)
        .attr("dy", 5);

    // Modal element creation
    const modal = d3.select("body").append("div")
        .attr("class", "component-modal")
        .style("display", "none")
        .html(`
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2 class="modal-title"></h2>
                <div class="modal-body">
                    <div class="description-section"></div>
                    <div class="risk-section"></div>
                    <div class="dependencies-section">
                        <h4>Dependencies:</h4>
                        <ul class="dependencies-list"></ul>
                    </div>
                </div>
            </div>
        `);

    // Modal styles
    d3.select("head").append("style")
        .text(`
            .component-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 1000;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .modal-content {
                background: white;
                padding: 25px;
                border-radius: 10px;
                max-width: 500px;
                position: relative;
            }
            .close-modal {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                cursor: pointer;
            }
            .dependencies-list {
                list-style: none;
                padding: 0;
            }
            .dependencies-list li {
                margin: 5px 0;
                padding: 5px;
                background: #f5f5f5;
                border-radius: 4px;
            }
        `);

    // Click handler for nodes
    node.on("click", function(event, d) {
        event.stopPropagation();
        const dependencies = links.filter(link => 
            link.source.id === d.id || link.target.id === d.id
        ).map(link => 
            link.source.id === d.id ? link.target.name : link.source.name
        );

        modal.style("display", "flex")
            .select(".modal-title").text(d.name);

        modal.select(".description-section")
            .html(`<p>${d.description}</p>`);

        modal.select(".risk-section")
            .html(riskStrategies[d.id] ? 
                `<h4>Risk Strategy:</h4><p>${riskStrategies[d.id]}</p>` : '');

        modal.select(".dependencies-list")
            .selectAll("li").remove()
            .data(dependencies).enter()
            .append("li")
            .text(dep => dep);

        // Bring clicked node to front
        d3.select(this).raise();
    });

    // Close modal handlers
    modal.select(".close-modal").on("click", () => {
        modal.style("display", "none");
    });

    d3.select(".component-modal").on("click", (event) => {
        if(event.target.classList.contains("component-modal")) {
            modal.style("display", "none");
        }
    });

    // Simulation setup
    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
        labels
            .attr("x", d => d.x + 25)
            .attr("y", d => d.y + 5);
    }

    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Zoom/pan functionality
    const zoom = d3.zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
            svg.attr("transform", event.transform);
        });

    svg.call(zoom);

    // Double-click isolation
    node.on("dblclick", function(event, d) {
        const connectedNodes = new Set([d.id]);
        const connectedLinks = links.filter(link => {
            if (link.source.id === d.id || link.target.id === d.id) {
                connectedNodes.add(link.source.id);
                connectedNodes.add(link.target.id);
                return true;
            }
            return false;
        });

        node.style("opacity", n => connectedNodes.has(n.id) ? 1 : 0.2);
        link.style("opacity", l => connectedLinks.includes(l) ? 1 : 0.2);
    });

    // Reset view
    svg.on("click", () => {
        node.style("opacity", 1);
        link.style("opacity", 1);
    });

    // Dynamic system status
    setInterval(() => {
        nodes.forEach(node => {
            if (components.tech.includes(node)) {
                node.operational = Math.random() > 0.1;
            }
        });
        
        node.select("circle")
            .attr("stroke", d => d.operational === false ? "#ff4444" : "#fff")
            .attr("stroke-width", d => d.operational === false ? 4 : 2);
    }, 3000);
});









  














