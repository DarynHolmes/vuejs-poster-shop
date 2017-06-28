
function subTotalPrice(subTotal, item) {
    return subTotal + (item.price * item.qty);
}

const LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        items: [],
        cart: [],
        results: [],
        newSearch: "90s",
        lastSearch: "",
        isLoading: false
    },
    computed: {

    },
    filters: {
        currency: function(price) {
            return '£ '.concat(price.toFixed(2));
        }
    },
    methods: {
        appendItems: function() {
            if (this.items.length >= this.results.length) {
                return;
            }
            this.items = this.items.concat(this.results.slice(this.items.length, this.items.length + LOAD_NUM));
        },
        total: function(cart) {
            return cart.reduce(subTotalPrice, 0);
        },
        addItem: function(index) {
            var item = this.items[index];
            var existingItem = this.cart.find(function(searchItem) { 
                return (searchItem.id === item.id);
            });
            if (existingItem) {
                return existingItem.qty++; 
            }
            var cartItem = Object.assign({}, item, { qty: 1 });
            
            this.cart.push(cartItem);
        },
        increment: function(index) {
            this.cart[index].qty++;
        },
        decrement: function(index) {
            this.cart[index].qty--;
            if (this.cart[index].qty === 0) {
                this.cart.splice(index, 1);
            }
        },
        onSubmit: function() {
            this.isLoading = true;
            this.items = [];
            axios.get('/search/'+this.newSearch)
                    .then(response => {
                        this.lastSearch = this.newSearch;
                        this.results = response.data.map( itm => ({ id: itm.id, title: itm.title, link: itm.link, price: 10.00 }) );
                        this.items = this.results.slice(0, LOAD_NUM);
                        this.isLoading = false;
                    })
                    .catch(error => {
                        this.isLoading = false;
                        console.log(error);
                    });
        }

    },
    mounted: function() {
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);

        watcher.enterViewport(() => {
            this.appendItems();
        });

        this.onSubmit();
    }
});

