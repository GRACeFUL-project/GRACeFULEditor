var linkId= 0;

function ExampleLink(graph) {
    var that = this;
    BaseLink.apply(this,arguments);

}

ExampleLink.prototype = Object.create(BaseLink.prototype);
ExampleLink.prototype.constructor = ExampleLink;
