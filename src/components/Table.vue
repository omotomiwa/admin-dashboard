<template>
  <v-app>
    <div class="home">
      <div class="table-container">
        <p class="table-heading">TABLE HEADING</p>
        <v-container>
          <div class="heading-container">
            <v-tabs
              v-model="tab"
              align-with-title
              class="tabs"
              background-color="grey lighten-3"
            >
              <v-tabs-slider color="deep-purple"></v-tabs-slider>

              <v-tab class="tabs" lower> All </v-tab>
              <v-tab class="tabs" v-model="paidUser" @click="paidUsers()">
                Paid
              </v-tab>
              <v-tab class="tabs" @click="unPaidUsers()"> Unpaid </v-tab>
              <v-tab class="tabs" @click="overdueUsers()"> Overdue </v-tab>
            </v-tabs>
            <div class="amount">
              <p class="total-amount x">Total payable amount:</p>
              <p class="digit x">${{ totalAmount }}</p>
              <p class="sign x">USD</p>
            </div>
          </div>
          <v-divider class="divider"></v-divider>

          <br />

          <div class="table-header-container">
            <div class="left-container">
              <div class="filter">
                <div class="text-center">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    offset-y
                    style="max-width: 224px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" class="filter-button">
                        <v-icon medium class="filter-icon"> mdi-filter </v-icon>
                        <span class="filter-text">Filter</span>
                      </v-btn>
                    </template>

                    <v-card class="menu">
                      <v-list>
                        <p class="sort">SORT BY:</p>
                        <v-list-item v-for="sort in sorts" :key="sort">
                          <v-list-item-content>
                            <v-list-item-subtitle>{{
                              sort
                            }}</v-list-item-subtitle>
                          </v-list-item-content>

                          <v-list-item-action>
                            <v-radio-group>
                              <v-radio
                                v-for="n in 1"
                                :key="n"
                                :value="n"
                                v-model="radioGroup"
                              ></v-radio>
                            </v-radio-group>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-card>

                    <v-list>
                      <p class="sort">Users:</p>
                      <v-list-item v-for="user in users" :key="user">
                        <v-list-item-content>
                          <v-list-item-subtitle>{{
                            user
                          }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-radio-group>
                            <v-radio
                              v-for="n in 1"
                              :key="n"
                              :value="n"
                              v-model="radioGroup"
                            ></v-radio>
                          </v-radio-group>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
              <div class="search">
                <form class="nosubmit">
                  <input
                    class="nosubmit"
                    type="search"
                    v-model="search"
                    placeholder="Search Users by Name, Email or Date..."
                  />
                </form>
              </div>
            </div>
            <div class="right-container">
              <v-btn class="pay-button" color="indigo"> PAY DUES </v-btn>
            </div>
          </div>

          <br />
          <v-data-table
            v-model="selected"
            :headers="headers"
            :email-filter="filterEmail"
            :single-select="singleSelect"
            item-key="name"
            show-select
            class="elevation-1"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            show-expand
          >
            <template v-slot:[`item.firstName`]="{ item }">
              <a small class="item-name"> {{ item.firstName }}</a
              ><br /><br />
              <p class="item-email">{{ item.email }}</p>
            </template>
            <template v-slot:[`header.icon`]="{ header }">
              <v-icon small class="more-info"> mdi-dots-vertical</v-icon
              >{{ header.text }}
            </template>
            <template v-slot:[`expanded-item`]="{ headers, item }">
              <td :colspan="headers.length">
                More info about {{ item.firstName }}
              </td>
            </template>

            <template v-slot:[`item.userStatus`]="{ item }">
              <v-icon class="item-user-status-icon icon"
                >mdi-circle-small</v-icon
              >
              <v-chip
                small
                class="item-user-status"
                outlined
                :color="getColor(item.userStatus)"
              >
                {{ item.userStatus }} </v-chip
              ><br />
              <p class="item-date">Last Login: {{ item.lastLogin }}</p>
            </template>
            <template v-slot:[`item.paymentStatus`]="{ item }">
              <v-icon class="icon">mdi-circle-small</v-icon>
              <v-chip
                small
                class="ma-2 item-payment-status"
                outlined
                :color="color(item.paymentStatus)"
              >
                {{ item.paymentStatus }} </v-chip
              ><br />
              <p class="item-payment-date">Dues On: {{ item.paidOn }}</p>
            </template>
            <template v-slot:[`item.amount`]="{ item }">
              <a small class="item-amount"> $ {{ item.amountInCents }} </a
              ><br /><br />
              <p class="item-usd">USD</p>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <a small class="view-more" @click="editItem(item)"> View More </a>
            </template>

            <template v-slot:[`item.icon`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-dots-vertical
              </v-icon>
            </template>
          </v-data-table>
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script>
//window.axios = require("axios");
export default {
  name: "Table-data",
  data() {
    return {
      tab: null,

      sorts: ["Default", "First Name", "Last Name", "Due Date", "Last Login"],
      users: ["All", "Active", "Inactive"],
      search: "",
      paidUser: "paid",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      fav: true,
      menu: false,
      message: false,
      hints: true,
      radioGroup: false,

      singleSelect: false,
      selected: [],
      expanded: [],
      singleExpand: false,
      headers: [
        { text: "", value: "data-table-expand" },
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "firstName",
        },

        { text: "USER STATUS", value: "userStatus" },

        { text: "PAYMENT STATUS", value: "paymentStatus" },
        { text: "AMOUNT", value: "amount" },

        { text: "", value: "actions" },
        { text: "", value: "icon" },
      ],

      desserts: [],
      totalAmount: null,
    };
  },
  methods: {
    getColor(userStatus) {
      if (userStatus == "active") return "#4A4AFF";
      else return "#6E6893";
    },
    geticonColor(userStatus) {
      var icon = document.getElementsByClassName("user-icon");
      if (userStatus == "active") return (icon.style.color = "#4A4AFF");
      else return (icon.style.color = "#6E6893");
    },
    color(paymentStatus) {
      if (paymentStatus == "paid") return "#007F00";
      else if (paymentStatus == "unpaid") return "#965E00";
      else return "#D30000";
    },
    // paidUsers() {
    //   return this.desserts.filter((table) => {
    //     const paid = table.paymentStatus.match(/paid/g);
    //     return paid;
    //     //console.log(paid);
    //   });
    // },
    // unPaidUsers() {
    //   return this.desserts.filter((table) => {
    //     const unPaid = table.paymentStatus.match(/unpaid/g);
    //     //return unPaid;
    //     console.log(unPaid);
    //   });
    // },
    // overdueUsers() {
    //   return this.desserts.filter((table) => {
    //     const overdue = table.paymentStatus.match(/overdue/g);
    //     //return overdue;
    //     console.log(overdue);
    //   });
    // },
    testing() {
      alert("hello");
    },
  },

  mounted: function () {
    const axios = require("axios");
    axios
      .get("https://cornie-assessment.herokuapp.com/users/Q166X71vhbcrZ3C")
      .then((response) => (this.desserts = response.data.data));
    setTimeout(() => {
      const list = this.desserts;
      const amounts = list.map((x) => x.amountInCents);
      const total = amounts.reduce((acc, val) => {
        return acc + val;
      }, 0);
      this.totalAmount = total;
    }, 3000);
  },

  computed: {
    filterName: function () {
      return this.desserts.filter((table) => {
        const filterByName = table.firstName.match(this.search);
        //const filterByEmail = table.email.match(this.search);
        //const filterByDate = table.lastLogin.match(this.search);
        return filterByName;
      });
    },
    filterEmail: function () {
      return this.desserts.filter((table) => {
        const filterByEmail = table.firstName.match(this.search);
        //const filterByEmail = table.email.match(this.search);
        //const filterByDate = table.lastLogin.match(this.search);
        return filterByEmail;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-container {
  background-color: #eeeeee;
}
.table-heading {
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.1em;
  color: #6e6893;
  padding-left: 100px;
  padding-top: 50px;
  position: relative;
  top: 5px;
}
.tabs {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: #25213b !important;
  position: relative !important;
  right: 20px !important;
}
.tab-items {
  border-radius: 6px;
}
.divider {
  position: relative;
  bottom: 17px;
}
.heading-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.amount {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  grid-gap: 5px;
}
.x {
  position: relative;
  top: 12px;
  color: #6e6893;
}
.total-amount {
  font-size: 14px;
  white-space: nowrap;
}
.digit {
  font-weight: 500;
  color: #6d5bd0;
}
.table-header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.left-container {
  display: flex;
  flex-direction: row;
  grid-gap: 15px;
}

/* everything about the filter goes here */
.filter {
  padding-left: 15px;
  padding-top: 15px;
}
.filter-button {
  background-color: #ffffff !important;
  border: 1px solid #c6c2de !important;
  width: 88px;
  height: 46px;
}
.filter-button:focus {
  outline: 1px solid #c6c2de !important;
}

.filter-icon {
  color: #6d5bd0 !important;
}
.filter-text {
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 12px !important ;
  line-height: 19px !important;
  color: #25213b !important;
}
.sort {
  padding-left: 15px;
  font-weight: 400;
  font-size: 12px;
  line-height: 25px;
  color: #6e6893;
}
.menu {
  width: 224px !important;
}

/* search field styling */
.search {
  padding-top: 15px;
}
form.nosubmit {
  border: none;

  padding: 0;
}

input.nosubmit {
  width: 392px;
  height: 38px;
  border: 1px solid #c6c2de;
  font-size: 12px;
  border-radius: 6px;
  display: block;
  padding: 9px 4px 9px 40px;
  background: #f4f2ff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E")
    no-repeat 13px center;
}

input:focus {
  outline: 1px solid #c6c2de;
}
.pay-button {
  color: #ffffff !important;
  width: 99px !important;
  position: relative;
  right: 15px;
  top: 15px;
  background-color: red;
  font-style: normal !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  line-height: 19px !important;
}

/* data table styling */

table.v-table thead th {
  font-size: 60px !important;
  color: red !important;
}
.theme--light.v-icon {
  color: #8b83ba !important;
}

.view-more {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #6e6893;
  white-space: nowrap;
}
/* v-slot template styling */
.item-name {
  color: #25213b;
  font-style: normal !important;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  position: relative;
  top: 15px;
}
.item-email {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.05em;
  color: #6e6893;
  white-space: nowrap;
}

.icon {
  color: red !important;
  font-size: 20px !important;
}
.item-user-status {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #4a4aff;
  position: relative;

  right: 18px;
}

.item-date {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #6e6893;
  position: relative;
  top: 10px;
  white-space: nowrap;
}
.item-payment-status {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #4a4aff;
  position: relative;
  right: 25px;
}
.item-payment-date {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #6e6893;
}
.item-amount {
  font-style: normal;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  color: #25213b !important;
  position: relative;
  top: 13px;
}
.item-usd {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #6e6893;
}
</style>
