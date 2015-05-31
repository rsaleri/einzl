var PageModel = Backbone.Model.extend({
    
    initialize: function(data) {
        
        this.data = data;
        this.view = new PageView(this.data.hbsPath);
        this.view.model = this;
    }
});