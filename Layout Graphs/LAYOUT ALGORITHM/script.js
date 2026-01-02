
    const cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
{
    selector: 'node',
    style: {
    'background-color': '#aec3b0',
    'border-width': 2,
    'border-color': '#eff6e0',
    'label': 'data(id)',
    'color': '#eff6e0',
    'text-valign': 'center',
    'text-halign': 'center',
    'font-size': '12px',
    'font-weight': 'bold',
    'width': 20,
    'height': 20
}
},
{
    selector: 'edge',
    style: {
    'width': 2,
    'line-color': '#aec3b0',
    'opacity': 0.7
}
}
    ],
    layout: {
    name: 'circle',
    radius: 200
}
});

    // Make Left Panel Draggable
    const panel = document.getElementById("draggablePanel");
    const handle = document.getElementById("dragHandle");
    let isDragging = false, offsetX = 0, offsetY = 0;

    handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    panel.classList.add('cursor-grabbing');
});

    document.addEventListener("mouseup", () => {
    isDragging = false;
    panel.classList.remove('cursor-grabbing');
    statsPanel.classList.remove('cursor-grabbing');
});

    document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    panel.style.left = `${e.clientX - offsetX}px`;
    panel.style.top = `${e.clientY - offsetY}px`;
});

    // Make Right Stats Panel Draggable
    const statsPanel = document.getElementById("statsPanel");
    const statsHandle = document.getElementById("statsDragHandle");
    let isStatsDragging = false, statsOffsetX = 0, statsOffsetY = 0;

    statsHandle.addEventListener("mousedown", (e) => {
    isStatsDragging = true;
    statsOffsetX = e.clientX - statsPanel.offsetLeft;
    statsOffsetY = e.clientY - statsPanel.offsetTop;
    statsPanel.classList.add('cursor-grabbing');
});

    document.addEventListener("mousemove", (e) => {
    if (!isStatsDragging) return;
    statsPanel.style.left = `${e.clientX - statsOffsetX}px`;
    statsPanel.style.top = `${e.clientY - statsOffsetY}px`;
});

    // Slider Value Display
    ["myRange1", "myRange2", "myRange3", "myRange4", "iterationRange", "epsilonRange"].forEach(id => {
    const slider = document.getElementById(id);
    const output = document.getElementById(id.replace('myRange', 'rangeValue').replace('iterationRange', 'iterationValue').replace('epsilonRange', 'epsilonValue'));
    if (output) {
    slider.oninput = () => output.textContent = slider.value;
}
});

    // Random Button
    document.getElementById("randomBtn").addEventListener("click", () => {
    const selectedLayout = document.getElementById('layoutSelect').value;

    if (selectedLayout === 'eades') {
    const slider1 = document.getElementById('myRange1');
    const slider2 = document.getElementById('myRange2');
    const slider3 = document.getElementById('myRange3');
    const slider4 = document.getElementById('myRange4');

    const rand1 = (Math.random() * 9.9 + 0.1).toFixed(1);
    const rand2 = Math.floor(Math.random() * 190 + 10);
    const rand3 = Math.floor(Math.random() * 19900 + 100);
    const rand4 = (Math.random() * 0.99 + 0.01).toFixed(2);

    slider1.value = rand1;
    slider2.value = rand2;
    slider3.value = rand3;
    slider4.value = rand4;

    document.getElementById('rangeValue1').textContent = rand1;
    document.getElementById('rangeValue2').textContent = rand2;
    document.getElementById('rangeValue3').textContent = rand3;
    document.getElementById('rangeValue4').textContent = rand4;
} else if (selectedLayout === 'fruchterman') {
    const slider1 = document.getElementById('myRange1');
    const slider2 = document.getElementById('myRange2');

    const rand1 = Math.floor(Math.random() * 190 + 10);
    const rand2 = (Math.random() * 0.99 + 0.01).toFixed(2);

    slider1.value = rand1;
    slider2.value = rand2;

    document.getElementById('rangeValue1').textContent = rand1;
    document.getElementById('rangeValue2').textContent = rand2;
}

    const sliderIter = document.getElementById('iterationRange');
    const sliderEpsilon = document.getElementById('epsilonRange');

    const randIter = Math.floor(Math.random() * 499 + 1);
    const randEpsilon = (Math.random() * 9.99 + 0.01).toFixed(2);

    sliderIter.value = randIter;
    sliderEpsilon.value = randEpsilon;

    document.getElementById('iterationValue').textContent = randIter;
    document.getElementById('epsilonValue').textContent = randEpsilon;
});

    class GraphVisualizer {
    constructor() {
    this.directed = false;
    this.weighted = false;
    this.labeled = true;
    this.adjList = {};
    this.nodeCount = 0;
    this.selectedNode = null;
    this.drawMode = false;
    this.animationRunning = false;
    this.forceHistory = [];
    this.epsilon = 0;
    this.avgForce = 0;
    this.updateControlPanel();
    this.setupEventListeners();
}

    updateControlPanel() {
    const layout = document.getElementById('layoutSelect').value;
    const slider1 = document.getElementById('myRange1');
    const slider2 = document.getElementById('myRange2');
    const slider3 = document.getElementById('myRange3');
    const slider4 = document.getElementById('myRange4');

    const label1 = document.querySelector('#slider1Container .slider-label');
    const label2 = document.querySelector('#slider2Container .slider-label');
    const label3 = document.querySelector('#slider3Container .slider-label');
    const label4 = document.querySelector('#slider4Container .slider-label');

    if (layout === 'eades') {
    // EADES parameters
    label1.textContent = 'C1 (Spring):';
    label2.textContent = 'C2 (Opt. Dist):';
    label3.textContent = 'C3 (Repulsion):';
    label4.textContent = 'C4 (Damping):';

    slider1.min = '0.1';
    slider1.max = '10';
    slider1.step = '0.1';
    slider1.value = '2';

    slider2.min = '10';
    slider2.max = '200';
    slider2.step = '1';
    slider2.value = '100';

    slider3.min = '100';
    slider3.max = '20000';
    slider3.step = '100';
    slider3.value = '10000';

    slider4.min = '0.01';
    slider4.max = '1';
    slider4.step = '0.01';
    slider4.value = '0.5';

    document.getElementById('slider1Container').style.display = 'flex';
    document.getElementById('slider2Container').style.display = 'flex';
    document.getElementById('slider3Container').style.display = 'flex';
    document.getElementById('slider4Container').style.display = 'flex';

} else if (layout === 'fruchterman') {
    // Fruchterman-Reingold parameters
    label1.textContent = 'ℓ:';
    label2.textContent = 'Damping:';

    slider1.min = '10';
    slider1.max = '200';
    slider1.step = '1';
    slider1.value = '100';

    slider2.min = '0.01';
    slider2.max = '1';
    slider2.step = '0.01';
    slider2.value = '0.5';

    document.getElementById('slider1Container').style.display = 'flex';
    document.getElementById('slider2Container').style.display = 'flex';
    document.getElementById('slider3Container').style.display = 'none';
    document.getElementById('slider4Container').style.display = 'none';
}

    // Update displayed values
    document.getElementById('rangeValue1').textContent = slider1.value;
    document.getElementById('rangeValue2').textContent = slider2.value;
    document.getElementById('rangeValue3').textContent = slider3.value;
    document.getElementById('rangeValue4').textContent = slider4.value;
}

    setupEventListeners() {
    cy.on('click', (evt) => {
    if (evt.target === cy && this.drawMode) this.addNode(evt.position);
});

    cy.on('click', 'node', (evt) => {
    if (!this.drawMode) return;
    const node = evt.target;
    if (this.selectedNode === null) {
    this.selectNode(node);
} else {
    if (node.id() === this.selectedNode.id()) {
    alert('Self loops are not allowed.');
} else {
    this.addEdge(this.selectedNode, node);
}
    this.deselectNode();
}
});

    document.getElementById('drawModeBtn').addEventListener('click', () => {
    this.drawMode = !this.drawMode;
    const btn = document.getElementById('drawModeBtn');
    if (this.drawMode) {
    btn.textContent = 'Disable Draw Mode';
    btn.classList.add('btn-draw-active');
    this.deselectNode();
} else {
    btn.textContent = 'Enable Draw Mode';
    btn.classList.remove('btn-draw-active');
}
});

    document.getElementById('resetBtn').addEventListener('click', () => {
    this.resetGraph();
});
}

    resetGraph() {
    if (this.animationRunning) {
    this.stopAnimation();
}

    cy.elements().remove();

    this.nodeCount = 0;
    this.selectedNode = null;
    this.forceHistory = [];
    this.epsilon = 0;
    this.avgForce = 0;
    this.adjList = {};

    document.getElementById('currentIteration').textContent = '0';
    document.getElementById('maxForce').textContent = '0.00';
    document.getElementById('avgForce').textContent = '0.00';
    document.getElementById('status').textContent = 'Idle';
    document.getElementById('forceHistory').innerHTML = '<div class="history-empty">No data yet</div>';

    this.deselectNode();
}

    addNode(position) {
    this.nodeCount++;
    let label = String(this.nodeCount);

    while (cy.getElementById(label).length > 0) {
    this.nodeCount++;
    label = String(this.nodeCount);
}

    cy.add({
    group: 'nodes',
    data: { id: label },
    position: position
});
}

    selectNode(node) {
    this.selectedNode = node;
    node.style({ 'background-color': '#598392', 'border-color': '#eff6e0' });
}

    deselectNode() {
    if (this.selectedNode) {
    this.selectedNode.style({ 'background-color': '#aec3b0' });
    this.selectedNode = null;
}
}

    addEdge(sourceNode, targetNode) {
    const src = sourceNode.id();
    const tgt = targetNode.id();
    const edgeId = `${src}-${tgt}`;
    const reverseId = `${tgt}-${src}`;

    if (cy.getElementById(edgeId).length > 0 || cy.getElementById(reverseId).length > 0) {
    alert('This edge already exists.');
    return;
}
    cy.add({ group: 'edges', data: { id: edgeId, source: src, target: tgt } });
}

    updateStats(iteration, maxForce, avgForce) {
    document.getElementById('currentIteration').textContent = iteration;
    document.getElementById('maxForce').textContent = maxForce.toFixed(4);
    document.getElementById('avgForce').textContent = avgForce.toFixed(4);

    const historyDiv = document.getElementById('forceHistory');
    const entry = document.createElement('div');
    entry.textContent = `Iter ${iteration}: Max=${maxForce.toFixed(2)}, Avg=${avgForce.toFixed(2)}`;

    if (this.forceHistory.length === 0) {
    historyDiv.innerHTML = '';
}

    historyDiv.appendChild(entry);
    this.forceHistory.push({ iteration, maxForce, avgForce });

    historyDiv.scrollTop = historyDiv.scrollHeight;

    if (this.forceHistory.length > 50) {
    this.forceHistory.shift();
    if (historyDiv.children.length > 50) {
    historyDiv.removeChild(historyDiv.firstChild);
}
}
}

    EADES() {
    const nodes = cy.nodes();
    const edges = cy.edges();
    const c_spring = parseFloat(document.getElementById('myRange1').value);
    const ell = parseFloat(document.getElementById('myRange2').value);
    const c_rep = parseFloat(document.getElementById('myRange3').value);
    const delta = parseFloat(document.getElementById('myRange4').value);

    const p = {};
    nodes.forEach(node => {
    const pos = node.position();
    p[node.id()] = { x: pos.x, y: pos.y };
});

    const F = {};
    nodes.forEach(node => {
    F[node.id()] = { x: 0, y: 0 };
});

    nodes.forEach(u => {
    const u_id = u.id();
    const p_u = p[u_id];

    nodes.forEach(v => {
    if (u.id() === v.id()) return;

    const v_id = v.id();
    const p_v = p[v_id];

    const dx = p_v.x - p_u.x;
    const dy = p_v.y - p_u.y;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq === 0) return;

    const distance = Math.sqrt(distanceSq);

    const f_rep_magnitude = c_rep / distanceSq;
    const unit_x = -dx / distance;
    const unit_y = -dy / distance;

    F[u_id].x += f_rep_magnitude * unit_x;
    F[u_id].y += f_rep_magnitude * unit_y;
});

    u.connectedEdges().forEach(edge => {
    const v = edge.source().id() === u_id ? edge.target() : edge.source();
    const v_id = v.id();
    const p_v = p[v_id];

    const dx = p_v.x - p_u.x;
    const dy = p_v.y - p_u.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 0.01;

    const f_spring_magnitude = c_spring * Math.log(distance / ell);
    const unit_x = dx / distance;
    const unit_y = dy / distance;

    F[u_id].x += f_spring_magnitude * unit_x;
    F[u_id].y += f_spring_magnitude * unit_y;
});
});

    let maxForce = 0;
    let totalForce = 0;

    nodes.forEach(u => {
    const u_id = u.id();
    const dampedFx = delta * F[u_id].x;
    const dampedFy = delta * F[u_id].y;

    const forceMag = Math.sqrt(dampedFx * dampedFx + dampedFy * dampedFy);
    maxForce = Math.max(maxForce, forceMag);
    totalForce += forceMag;

    p[u_id].x += dampedFx;
    p[u_id].y += dampedFy;
});

    const avgForce = nodes.length > 0 ? totalForce / nodes.length : 0;
    this.avgForce = avgForce;

    nodes.forEach(node => {
    node.position(p[node.id()]);
});

    return { maxForce, avgForce };
}

        // Add this property to your class
// this.temperature = initial_width / 10;

     FruchtermanReingold() {
    const nodes = cy.nodes();
    const edges = cy.edges();
    // In FR, 'k' is the optimal distance (ell in your code)
    const k = parseFloat(document.getElementById('myRange1').value);

    // 1. Initialize forces
    const F = {};
    nodes.forEach(node => F[node.id()] = { x: 0, y: 0 });

    const p = {};
    nodes.forEach(node => p[node.id()] = node.position());

    // 2. Calculate Repulsive Forces (k^2 / d)
    nodes.forEach(v => {
        nodes.forEach(u => {
            if (v.id() === u.id()) return;

            const dx = p[v.id()].x - p[u.id()].x;
            const dy = p[v.id()].y - p[u.id()].y;
            const dist = Math.sqrt(dx*dx + dy*dy) || 0.01;

            if (dist > 0) {
                const fr = (k * k) / dist;
                F[v.id()].x += (dx / dist) * fr;
                F[v.id()].y += (dy / dist) * fr;
            }
        });
    });

    // 3. Calculate Attractive Forces (d^2 / k)
    edges.forEach(edge => {
        const uId = edge.source().id();
        const vId = edge.target().id();

        const dx = p[vId].x - p[uId].x;
        const dy = p[vId].y - p[uId].y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 0.01;

        const fa = (dist * dist) / k;

        const xComp = (dx / dist) * fa;
        const yComp = (dy / dist) * fa;

        F[vId].x -= xComp;
        F[vId].y -= yComp;

        F[uId].x += xComp;
        F[uId].y += yComp;
    });

    // 4. Update Positions
    const currentTemperature = parseFloat(document.getElementById('myRange2').value);

    let maxForce = 0;
    let totalForce = 0;

    nodes.forEach(n => {
        const nid = n.id();
        const disp = { x: F[nid].x, y: F[nid].y };
        const dispMag = Math.sqrt(disp.x*disp.x + disp.y*disp.y) || 0.01;

        // Limit the movement by the temperature
        const magnitude = Math.min(dispMag, currentTemperature);

        const moveX = (disp.x / dispMag) * magnitude;
        const moveY = (disp.y / dispMag) * magnitude;

        p[nid].x += moveX;
        p[nid].y += moveY;

        maxForce = Math.max(maxForce, dispMag);
        totalForce += dispMag;
    });

    // Apply new positions
    nodes.forEach(node => {
        node.position(p[node.id()]);
    });

    const avgForce = nodes.length > 0 ? totalForce / nodes.length : 0;
    
    // --- THE FIX IS HERE ---
    this.avgForce = avgForce; 
    // -----------------------

    return { maxForce, avgForce };
}
    startAnimation() {
    if (this.animationRunning) return;

    this.animationRunning = true;
    this.forceHistory = [];
    this.avgForce = Infinity;

    const maxIterations = parseInt(document.getElementById('iterationRange').value);
    this.epsilon = parseFloat(document.getElementById('epsilonRange').value);
    const selectedLayout = document.getElementById('layoutSelect').value;
    let currentIteration = 0;

    document.getElementById('status').textContent = 'Running...';
    document.getElementById('forceHistory').innerHTML = '';

    const animate = () => {
    if (!this.animationRunning) {
    document.getElementById('status').textContent = 'Stopped';
    return;
}

    if (currentIteration >= maxIterations) {
    this.stopAnimation();
    document.getElementById('status').textContent = 'Completed (Max Iterations)';
    return;
}

    if (this.avgForce < this.epsilon && currentIteration > 0) {
    this.stopAnimation();
    document.getElementById('status').textContent = 'Converged (Avg Force < Epsilon)';
    return;
}

    currentIteration++;

    let stats = { maxForce: 0, avgForce: 0 };
    if (selectedLayout === 'eades') {
    stats = this.EADES();
} else if (selectedLayout === 'fruchterman') {
    stats = this.FruchtermanReingold();
}

    this.updateStats(currentIteration, stats.maxForce, stats.avgForce);

    requestAnimationFrame(animate);
};

    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('stopBtn').classList.remove('hidden');
    animate();
}

    stopAnimation() {
    this.animationRunning = false;
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
}
}

    let graph = new GraphVisualizer();

    document.getElementById('layoutSelect').addEventListener('change', () => {
    graph.updateControlPanel();
});

    document.getElementById('startBtn').addEventListener('click', () => {
    if (cy.nodes().length === 0) {
    alert('Please add some nodes first using Draw Mode.');
    return;
}
    graph.startAnimation();
});

    document.getElementById('stopBtn').addEventListener('click', () => {
    graph.stopAnimation();
});
