<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await authStore.authorizeUser();
});

const signinButton = () => {
  void router.push('/auth/login');
};

const signupButton = () => {
  void router.push('/auth/register');
};

const gotoDashboard = () => {
  void router.push(`${authStore.currentAccount?.role}`);
};

// For the role-based features section
const roleFeatures = [
  {
    role: 'For Students',
    icon: 'school',
    features: [
      'View all your classes in one place',
      'Check your attendance records',
      'Receive notifications for class changes',
      'Submit attendance via QR code',
      'Access attendance history for all courses',
    ],
  },
  {
    role: 'For Teachers',
    icon: 'assignment_ind',
    features: [
      'Manage multiple classes easily',
      'Take attendance with one click',
      'Generate QR codes for class sessions',
      'View detailed attendance reports',
      'Communicate with students directly',
    ],
  },
  {
    role: 'For Department Heads',
    icon: 'supervisor_account',
    features: [
      'Monitor attendance across all courses',
      'Generate department-wide reports',
      'Track faculty performance metrics',
      'Set attendance policies and thresholds',
      'Get real-time insights on attendance trends',
    ],
  },
  {
    role: 'For Administrators',
    icon: 'admin_panel_settings',
    features: [
      'Manage all users and permissions',
      'Configure system-wide settings',
      'Access comprehensive analytics',
      'Generate institution-wide reports',
      'Integrate with existing systems',
    ],
  },
];

// For testimonials
const testimonials = [
  {
    name: 'Mohaymen Omar',
    role: 'Student',
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocJXxAYoLL8jr6Thv6ME3C_l5zknqDfUSQGRUPOg_PcpG-_wvLo0=s96-c',
    rating: 5,
    quote:
      'I really enjoyed using the web app as it made my work easier! I love how it organizes my classes.',
  },
  {
    name: 'Bin Jamal Abduljalel',
    role: 'Student',
    image:
      'https://lh3.googleusercontent.com/a-/ALV-UjVlsihMIjso3l6UKsjQX4ySkOAz-rqaUTX0bPJkUTKd4a9XD0k=s96-c',
    rating: 5,
    quote:
      'The attendance system is very efficient and has saved me a lot of time. It’s a great tool for students.',
  },
  {
    name: 'Omar Batocala',
    role: 'Student',
    image:
      'https://lh3.googleusercontent.com/a-/ALV-UjXG2lyEv3nfTmLXr-UAx-21iq78OGuICRLf5T6V8nFTwy6SGTA=s96-c',
    rating: 4,
    quote:
      'Being able to check my attendance history for all courses in one place has been incredibly helpful.',
  },
  {
    name: 'Sarhan Mundig',
    role: 'Teacher',
    image:
      'https://lh3.googleusercontent.com/a-/ALV-UjXpacO_OK2NGnka6jxYPXd-iUNvk2G62kqyA-xciJFPtoSvHDM=s96-c',
    rating: 5,
    quote:
      'Taking attendance is now quick and efficient. The detailed reports help me identify attendance patterns easily.',
  },
  {
    name: 'Rafael Panalondong',
    role: 'Administrator',
    image:
      'https://lh3.googleusercontent.com/a-/ALV-UjWC7CfQfd5HNC0zleMloSNUtHVPaxwb8fXyEtU55tBrccPZVYY=s96-c',
    rating: 5,
    quote:
      'The institution-wide analytics have transformed how we track and improve attendance across departments.',
  },
  {
    name: 'Amal Sultan',
    role: 'Student',
    image:
      'https://lh3.googleusercontent.com/a-/ALV-UjWP0P00BAHC2TsW2WpKGAk4jhlYDCKYmhlpKARrsFwpW7NDyCU=s96-c',
    rating: 4,
    quote:
      'The platform is user-friendly and helps me stay on top of my attendance and class schedules.',
  },
  {
    name: 'Abdul Bari Azis',
    role: 'Teacher',
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocIVCZE9modXDFg6Xlm9gk1geAI5B3WQ0RTLeKMF5bRkvzDO7Q=s96-c-mo',
    rating: 5,
    quote:
      'The system has streamlined my workflow completely. I can focus more on teaching and less on administrative tasks.',
  },
];

// For statistics section
const statistics = [
  {
    value: '96%',
    label: 'Attendance Rate',
  },
  {
    value: '+5083',
    label: 'Active Students',
  },
  {
    value: '86%',
    label: 'Time Saved',
  },
  {
    value: '100%',
    label: 'User Satisfaction',
  },
];

// For access portal links
const portalLinks = [
  { label: 'Student Portal', icon: 'school', link: '/auth/login' },
  { label: 'Teacher Portal', icon: 'assignment_ind', link: '/auth/login' },
  { label: 'Department Portal', icon: 'supervisor_account', link: '/auth/login' },
  { label: 'Admin Portal', icon: 'admin_panel_settings', link: '/auth/login' },
];
</script>

<template>
  <q-page>
    <!-- Hero Section -->
    <section id="home" class="hero-section">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-6 text-center text-md-left">
            <h1 class="text-h2 text-weight-bold q-mb-md">Q-attdance System</h1>
            <p class="text-body1 q-mb-lg">
              Centralize all your attendance tracking in a single, intuitive application with
              real-time updates and detailed analytics.
            </p>
            <div class="q-gutter-md">
              <div v-if="authStore.currentAccount">
                <q-btn size="lg" color="primary" label="Go to Dashboard" @click="gotoDashboard" />
              </div>
              <div v-else class="row q-col-gutter-md">
                <div class="col-12 col-sm-auto">
                  <q-btn size="lg" color="primary" label="Get Started" @click="signupButton" />
                </div>
                <div class="col-12 col-sm-auto">
                  <q-btn size="lg" outline color="primary" label="Sign In" @click="signinButton" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 text-center q-pt-md q-pt-md-none">
            <!-- Mobile App Mockup -->
            <div class="phone-mockup">
              <div class="phone-header">
                <div class="header-content">
                  <q-icon name="menu" size="sm" />
                  <div class="logo-container">
                    <span class="user-greeting">Hi, Nami</span>
                  </div>
                  <div>
                    <q-icon name="add" size="sm" class="add-icon" />
                    <q-avatar size="24px">
                      <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                    </q-avatar>
                  </div>
                </div>
              </div>
              <div class="phone-content">
                <div class="class-list">
                  <!-- First class card -->
                  <div class="class-card">
                    <div class="class-header brown-header">
                      <div>
                        <div class="class-code">ITE125</div>
                        <div class="class-section">WwXx</div>
                      </div>
                      <q-icon name="more_vert" size="sm" />
                    </div>
                    <div class="class-details">
                      <div class="class-info">Class Code: 3L8G</div>
                      <div class="teacher-info">Monkey D. Luffy</div>
                    </div>
                  </div>

                  <!-- Second class card -->
                  <div class="class-card">
                    <div class="class-header purple-header">
                      <div>
                        <div class="class-code">ITE153</div>
                        <div class="class-section">FfGg</div>
                      </div>
                      <q-icon name="more_vert" size="sm" />
                    </div>
                    <div class="class-details">
                      <div class="class-info">Class Code: WOM1</div>
                      <div class="teacher-info">Roronoa Zoro</div>
                    </div>
                  </div>

                  <!-- Third class card -->
                  <div class="class-card">
                    <div class="class-header primary-header">
                      <div>
                        <div class="class-code">CCC181</div>
                        <div class="class-section">*</div>
                      </div>
                      <q-icon name="more_vert" size="sm" />
                    </div>
                    <div class="class-details">
                      <div class="class-info">Class Code: DA8I</div>
                      <div class="teacher-info">Nico Robin</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Role-Based Features Section -->
    <section id="features" class="role-features-section">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold q-mb-md">Role-Based Features</h2>
          <p class="text-body1 q-mx-auto" style="max-width: 700px">
            Q-attdance System is designed to cater to the needs of different roles for more
            effective and productive attendance management.
          </p>
        </div>

        <div class="row q-col-gutter-lg">
          <div
            v-for="(roleFeature, index) in roleFeatures"
            :key="index"
            class="col-12 col-sm-6 col-md-3"
          >
            <q-card class="role-feature-card">
              <q-card-section class="text-center">
                <q-icon :name="roleFeature.icon" size="3rem" color="primary" />
                <h3 class="text-h5 text-weight-bold q-mt-md">{{ roleFeature.role }}</h3>
                <q-list dense>
                  <q-item
                    v-for="(feature, featureIndex) in roleFeature.features"
                    :key="featureIndex"
                  >
                    <q-item-section avatar>
                      <q-icon name="check" color="positive" size="xs" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ feature }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold q-mb-md">What Our Users Say</h2>
          <p class="text-body1 q-mx-auto" style="max-width: 700px">
            Customers from top universities worldwide have transformed their attendance tracking
            with Q-attdance.
          </p>
        </div>

        <div class="row q-col-gutter-lg justify-center">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="col-12 col-md-8">
            <q-card class="testimonial-card">
              <q-card-section>
                <div class="row items-center">
                  <div class="col-auto" style="margin-right: 1rem">
                    <q-avatar size="60px">
                      <img :src="testimonial.image" />
                    </q-avatar>
                  </div>
                  <div class="col">
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-weight-bold">{{ testimonial.name }}</div>
                        <div class="text-caption">{{ testimonial.role }}</div>
                      </div>
                      <div class="col-auto">
                        <div class="rating">
                          <q-icon
                            v-for="n in 5"
                            :key="n"
                            name="star"
                            :color="n <= testimonial.rating ? 'amber' : 'grey'"
                            size="1.2em"
                          />
                        </div>
                      </div>
                    </div>
                    <p class="text-body1 q-mt-sm">"{{ testimonial.quote }}"</p>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section id="about" class="stats-section">
      <div class="container">
        <h2 class="text-h3 text-weight-bold text-center q-mb-xl">Proven Results</h2>
        <div class="row q-col-gutter-md">
          <div v-for="(stat, index) in statistics" :key="index" class="col-6 col-md-3">
            <div class="stat-card text-center">
              <div class="text-h2 text-weight-bold text-white">{{ stat.value }}</div>
              <div class="text-subtitle1 text-white">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="contact" class="footer-section">
      <div class="container">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-4">
            <h4 class="text-h6 text-weight-bold">Contact Us</h4>
            <p class="q-mb-xs">
              <q-icon name="email" size="xs" class="q-mr-sm" />
              info@q-attdance.com
            </p>
            <p class="q-mb-xs">
              <q-icon name="phone" size="xs" class="q-mr-sm" />
              +1-800-555-0123
            </p>
          </div>

          <div class="col-12 col-md-8">
            <h4 class="text-h6 text-weight-bold">Access Portal</h4>
            <div class="row q-col-gutter-md">
              <div
                v-for="(portal, index) in portalLinks"
                :key="index"
                class="col-12 col-sm-6 col-md-3"
              >
                <q-btn
                  outline
                  color="white"
                  :label="portal.label"
                  :icon="portal.icon"
                  :to="portal.link"
                  class="full-width"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row copyright-section q-mt-xl">
          <div class="col-12 text-center">
            <p class="text-caption q-mb-none">
              © {{ new Date().getFullYear() }} Q-attdance System • All rights reserved
            </p>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<style lang="scss">
// General Styles
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

section {
  padding: 5rem 0;
}

// Primary color
$primary-color: #790622;

// Hero Section
.hero-section {
  background: #ffffff;
  min-height: 80vh;
  display: flex;
  align-items: center;

  h1 {
    color: $primary-color;
    line-height: 1.2;
  }

  p {
    color: #666;
    max-width: 500px;
  }

  // Phone mockup styling
  .phone-mockup {
    width: 320px;
    height: 640px;
    background-color: #f5f5f5;
    border-radius: 30px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border: 8px solid #fff;
    margin: 0 auto;
    position: relative;

    .phone-header {
      background-color: #fff;
      color: $primary-color;
      padding: 15px;
      position: relative;
      border-bottom: 1px solid #eee;

      .header-content {
        display: flex;
        justify-content: space-between;
      }

      .logo-container {
        display: flex;
        align-items: left;
        gap: 8px;

        .logo-icon {
          background-color: #e3f2fd;
          border-radius: 50%;
          padding: 4px;
        }

        .user-greeting {
          font-weight: 500;
          color: $primary-color;
        }
      }

      .add-icon {
        color: #757575;
      }
    }

    .phone-content {
      padding: 15px;
      background-color: #f5f5f5;
      height: calc(100% - 60px);
      overflow-y: auto;

      .class-list {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .class-card {
          background-color: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

          .class-header {
            padding: 15px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .class-code {
              font-size: 1.2rem;
              font-weight: bold;
              margin-bottom: 4px;
            }

            .class-section {
              font-size: 0.9rem;
              opacity: 0.9;
            }

            &.brown-header {
              background-color: #795548;
            }

            &.purple-header {
              background-color: #9c27b0;
            }

            &.primary-header {
              background-color: $primary-color;
            }
          }

          .class-details {
            padding: 15px;

            .class-info {
              font-size: 0.9rem;
              color: #333;
              margin-bottom: 8px;
            }

            .teacher-info {
              font-size: 0.9rem;
              color: #666;
            }
          }
        }
      }
    }
  }
}

// Role Features Section
.role-features-section {
  background-color: #fff;

  .role-feature-card {
    height: 100%;
    border-radius: 12px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    border: 1px solid #eee;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    }

    .q-icon {
      color: $primary-color;
    }

    h3 {
      color: $primary-color;
    }

    .q-list {
      margin-top: 1rem;
    }
  }
}

// Demo Section
.demo-section {
  background-color: #f9f9f9;

  .demo-card {
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
  }
}

// Class Code Section
.class-code-section {
  background-color: #fff;

  .class-code-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

    .q-card-section {
      padding: 2rem;
    }
  }
}

// Testimonials Section
.testimonials-section {
  background-color: #f9f9f9;

  .testimonial-card {
    border-radius: 12px;
    transition: transform 0.3s ease;
    border: 1px solid #eee;
    overflow: hidden;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    }

    .rating {
      display: flex;
      gap: 2px;
    }
  }
}

// Stats Section
.stats-section {
  background-color: $primary-color;
  color: white;
  padding: 3rem 0;

  .stat-card {
    padding: 2rem 1rem;
    text-align: center;

    .text-h2 {
      font-size: 2.5rem;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
  }
}

// Footer Section
.footer-section {
  background-color: $primary-color;
  color: white;
  padding: 4rem 0 2rem;

  h4 {
    margin-bottom: 1.5rem;
  }

  .copyright-section {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    margin-top: 1.5rem;
  }
}

// Responsive Adjustments
@media (max-width: 767px) {
  section {
    padding: 3rem 0;
  }

  .hero-section {
    min-height: auto;
    padding-top: 2rem;
    text-align: center;

    h1 {
      font-size: 2.5rem;
    }

    .phone-mockup {
      margin-top: 2rem;
      width: 280px;
      height: 560px;
    }
  }

  .stats-section .stat-card .text-h2 {
    font-size: 2rem;
  }
}
</style>
