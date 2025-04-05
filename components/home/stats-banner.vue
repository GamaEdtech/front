<template>
  <v-container fluid id="stats-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="gama-text-h4">The best are here.</h2>
          <div id="stats-section">
            <v-row>
              <v-col
                cols="6"
                sm="4"
                md="2"
                v-for="(item, index) in stats"
                :key="index"
                class="text-center"
              >
                <div class="stat-container">
                  <span :class="item.icon" class="item-icon"></span>
                  <div class="item-stat gama-text-h6">
                    +{{ $numberFormat(item.stat) }}
                  </div>
                  <div class="item-title gama-text-caption">
                    {{ item.title }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <p class="describe gama-text-h6">These are professional numbers</p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "stats-banner",
  data() {
    return {
      stats: [
        {
          icon: "icon-school",
          stat: "130000",
          title: "Schools",
        },
        {
          icon: "icon-teacher",
          stat: "500000",
          title: "Teacher",
        },
        {
          icon: "icon-student",
          stat: "3000000",
          title: "Student",
        },
        {
          icon: "icon-exam",
          stat: "7000",
          title: "QuizHub",
        },
        {
          icon: "icon-q-a",
          stat: "60000",
          title: "Forum",
        },
        {
          icon: "icon-multimedia",
          stat: "37000",
          title: "Multimedia",
        },
      ],
    };
  },
};
</script>

<style>
#stats-container {
  height: 38.6rem;
  padding: 2.4rem 0 2.4rem 0;
  background: #24292f;
  color: #ffffff;

  text-align: center;

  .gama-text-h4 {
    color: #f3f3fb;
    margin-bottom: 0.3rem;
  }

  .describe {
    color: #f3f3fb;
    opacity: 0.30000001192092896;
    margin-top: 1.4rem;
  }

  #stats-section {
    width: 31.2rem;
    margin: auto auto;

    .stat-container {
      position: relative;
      text-align: left;
      padding-top: 2.3rem;
      padding-bottom: 2.3rem;

      .item-icon {
        font-size: 2rem;
        color: #ffb600;
      }

      .item-stat {
        position: absolute;
        color: #fff;
        top: 2.6rem;
        left: 2.8rem;
      }

      .item-title {
        position: absolute;
        color: #fff;
        left: 2.8rem;
      }
    }
  }
}

@media (min-width: 600px) {
  #stats-container {
    height: 38.1rem;
    padding: 4.8rem 0 4.8rem 0;

    .gama-text-h4 {
      margin-bottom: 2.4rem;
    }

    .describe {
      margin-top: 3.2rem;
    }

    #stats-section {
      width: 54.4rem;
      margin: auto auto;

      .stat-container {
        position: relative;
        text-align: left;
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        .item-icon {
          font-size: 2.4rem;
          color: #ffb600;
        }

        .item-stat {
          position: absolute;
          color: #fff;
          top: 2.4rem;
          left: 2.8rem;
        }

        .item-title {
          position: absolute;
          color: #fff;
          top: 4.8rem;
          left: 3rem;
        }
      }
    }
  }
}

@media (min-width: 960px) {
  #stats-container {
    height: 31.6rem;
    padding: 3.6rem 0 4.8rem 0;
    background: #24292f;
    color: #ffffff;
    text-align: center;

    .gama-text-h4 {
      color: #f3f3fb;
      margin-bottom: 1.2rem;
    }

    .describe {
      color: #f3f3fb;
      opacity: 0.30000001192092896;
      margin-top: 0.15rem;
    }

    #stats-section {
      width: 100%;

      margin: auto auto;

      .stat-container {
        text-align: center;

        .item-icon {
          position: static;
          font-size: 4.8rem;
          color: #ffb600;
          margin-bottom: 1.6rem;
        }

        .item-stat {
          position: static;
          color: #fff;
          margin-bottom: 0.4rem;
        }

        .item-title {
          position: static;
          color: #fff;
        }
      }
    }
  }
}
</style>

<!--
<template>
    <v-container fluid id="stats-container">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <h2 class="gama-text-h4">The best are here.</h2>
                    <v-row>
                        <v-col cols="6" sm="4" md="2" v-for="(item,index) in stats"
                        :key="index" class="text-center">
                            <span :class="item.icon" class="item-icon" ></span>
                            <div class="item-stat">
                                +{{ $numberFormat(item.stat) }}
                            </div>
                            <div class="item-title">
                                {{ item.title }}
                            </div>
                        </v-col>
                    </v-row>
                    <p class="describe">
                        These are professional numbers
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script >
export default {
    name: "stats-banner",
    data() {
        return {
            stats: [
                {
                    icon: 'icon-school',
                    stat: '130000',
                    title: 'Schools'
                },
                {
                    icon: 'icon-teacher',
                    stat: '500000',
                    title: 'Teacher'
                },
                {
                    icon: 'icon-student',
                    stat: '3000000',
                    title: 'Student'
                },
                {
                    icon: 'icon-exam',
                    stat: '7000',
                    title: 'Exam'
                },
                {
                    icon: 'icon-q-a',
                    stat: '60000',
                    title: 'Q&A'
                },
                {
                    icon: 'icon-multimedia',
                    stat: '37000',
                    title: 'Multimedia'
                },
            ]
        }
    }
}
</script>

<style>
#stats-container {
    padding: 4.8rem 0 4.8rem 0;
    background: #24292F;
    color: #FFFFFF;
    text-align: center;

    .gama-text-h4 {
        color: #F3F3FB;
        margin-bottom: 4.4rem;
    }

    .describe {
        color: #F3F3FB;
        opacity: 0.30000001192092896;
        font-family: 'Inter';
        font-size: 2.2rem;
        margin-top: 3.75rem;
        font-style: normal;
        font-weight: 500;
        line-height: 4.4rem;
    }

    .item-icon{
        font-size: 4.8rem;
        color: #ffb600;
    }

    .item-stat {
        color: #FFF;
        font-family: 'Inter';
        font-size: 2.2rem;
        font-style: normal;
        font-weight: 750;
        line-height: 4.4rem;
    }

    .item-title {
        color: #FFF;
        font-size: 1.8rem;
        font-style: normal;
        font-weight: 300;
        line-height: 2.4rem;
    }
}
</style> -->
