<NavigatorIOS
        ref='nav'
        initialRoute={{
            component: HomePage,
            title: 'GAT Tasks' ,
            navigationBarHidden: false,
            rightButtonTitle: 'Login',
            onRightButtonPress: () => this._gotoLoginPage(),
        }}
        style={{flex: 1}}
        />