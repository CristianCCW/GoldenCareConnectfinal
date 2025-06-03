
import requests
import sys
import json
from datetime import datetime

class GoldenCareConnectAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2)}")
                    self.test_results.append({
                        "name": name,
                        "status": "PASSED",
                        "response": response_data
                    })
                    return success, response_data
                except:
                    print(f"Response: {response.text}")
                    self.test_results.append({
                        "name": name,
                        "status": "PASSED",
                        "response": response.text
                    })
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                self.test_results.append({
                    "name": name,
                    "status": "FAILED",
                    "expected_status": expected_status,
                    "actual_status": response.status_code,
                    "response": response.text
                })
                return success, None

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "status": "ERROR",
                "error": str(e)
            })
            return False, None

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api",
            200
        )

    def test_submit_contact_form(self, name, email, message):
        """Test submitting a contact form"""
        return self.run_test(
            "Submit Contact Form",
            "POST",
            "api/contact",
            200,
            data={"name": name, "email": email, "message": message}
        )

    def test_get_contact_inquiries(self):
        """Test retrieving contact inquiries"""
        return self.run_test(
            "Get Contact Inquiries",
            "GET",
            "api/contact",
            200
        )

    def print_summary(self):
        """Print a summary of all test results"""
        print("\n" + "="*50)
        print(f"📊 TEST SUMMARY: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*50)
        
        for result in self.test_results:
            status_icon = "✅" if result["status"] == "PASSED" else "❌"
            print(f"{status_icon} {result['name']}: {result['status']}")
        
        print("="*50)
        return self.tests_passed == self.tests_run

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "https://0d89a936-e5ea-429c-9df7-a994fafcbf61.preview.emergentagent.com"
    
    print(f"Testing API at: {backend_url}")
    
    # Setup tester
    tester = GoldenCareConnectAPITester(backend_url)
    
    # Test 1: Root API endpoint
    tester.test_root_endpoint()
    
    # Test 2: Submit a contact form
    test_name = "John Smith"
    test_email = "john@test.com"
    test_message = "I need help with my tablet"
    
    success, response = tester.test_submit_contact_form(test_name, test_email, test_message)
    
    # Test 3: Get contact inquiries
    if success:
        tester.test_get_contact_inquiries()
    
    # Print summary
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
